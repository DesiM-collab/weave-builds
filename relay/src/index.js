// Galaxy Continuity relay (PROTOCOL.md §1.3).
//
// A rendezvous point for one paired Mac and phone when they cannot reach each other directly.
// It forwards opaque bytes: the devices run their usual pinned mutual-TLS session through it, so
// the relay never sees message content and cannot impersonate either side.
//
// One Durable Object per room. The room id is a 256-bit value only the two paired devices know.
// The Mac keeps a WebSocket open and waits; the phone joins when it wants a session.
//   text frames  : relay -> Mac only ("joined:<n>", "left:<n>")
//   binary frames: forwarded to the other side unchanged

const ROOM_PATH = /^\/v1\/room\/([0-9a-f]{64})$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Any web page may ask whether the relay is up (the setup guide's check); nothing else is exposed.
    if (url.pathname === "/health") return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
    const m = ROOM_PATH.exec(url.pathname);
    if (!m) return new Response("not found", { status: 404 });
    return env.ROOMS.get(env.ROOMS.idFromName(m[1])).fetch(request);
  },
};

export class Room {
  constructor(state) {
    this.state = state;
  }

  open(role) {
    return this.state.getWebSockets(role).filter((ws) => ws.readyState === 1);
  }

  async fetch(request) {
    const role = new URL(request.url).searchParams.get("role");
    if (request.headers.get("Upgrade") !== "websocket" || (role !== "mac" && role !== "phone")) {
      return new Response("expected a websocket with role=mac|phone", { status: 400 });
    }
    // Without a waiting Mac there is nothing to connect to: tell the phone at once.
    if (role === "phone" && this.open("mac").length === 0) {
      return new Response("mac offline", { status: 404 });
    }
    // A new connection replaces an older one of the same role (reconnects after a network change).
    for (const old of this.open(role)) {
      try { old.close(4409, "replaced"); } catch {}
    }
    const session = crypto.randomUUID();
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.state.acceptWebSocket(server, [role]);
    server.serializeAttachment({ role, session });

    if (role === "phone") {
      for (const mac of this.open("mac")) mac.send("joined:" + session);
    } else {
      // A phone left over from the previous Mac connection has no one to talk to.
      for (const phone of this.open("phone")) {
        try { phone.close(4410, "mac reconnected"); } catch {}
      }
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(ws, message) {
    if (typeof message === "string") return; // devices send data only
    const { role } = ws.deserializeAttachment();
    for (const peer of this.open(role === "mac" ? "phone" : "mac")) {
      if (peer !== ws) peer.send(message);
    }
  }

  webSocketClose(ws) {
    this.gone(ws);
  }

  webSocketError(ws) {
    this.gone(ws);
  }

  gone(ws) {
    const { role, session } = ws.deserializeAttachment();
    if (role === "phone") {
      // The Mac ignores "left" for any session but its current one.
      for (const mac of this.open("mac")) mac.send("left:" + session);
    } else if (this.open("mac").filter((m) => m !== ws).length === 0) {
      for (const phone of this.open("phone")) {
        try { phone.close(4410, "mac left"); } catch {}
      }
    }
    try { ws.close(1000, "bye"); } catch {}
  }
}
