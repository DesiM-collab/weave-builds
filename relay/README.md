# Weave relay

A tiny Cloudflare Worker that lets your Weave devices reach each other when they are not on the
same Wi-Fi. It only forwards bytes: your phone and computers encrypt everything before it leaves
them, so the relay cannot read or change what passes through. It runs in **your own** free
Cloudflare account.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/DesiM-collab/weave-builds/tree/main/relay)

After it deploys, open `<your relay address>/health`: it shows `ok`. Then paste the address into
Weave → Settings → Internet relay on each computer and connect your phone once on Wi-Fi.
