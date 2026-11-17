# Weave

Your Android phone on your Mac and Windows PC: notifications, texts, calls, photos, files, the
clipboard, the phone's screen, and remote control of each computer from the others. Everything
goes directly between your own devices, encrypted.

This repository holds the finished apps (and the optional relay). The apps update themselves
from here.

**[Open the step-by-step setup guide →](https://desim-collab.github.io/weave-builds/)**
It shows only the steps for your devices, tracks your progress, and can check your relay.

## Download

| Device | Download |
|---|---|
| Android phone (Android 14+) | [galaxy-continuity-debug.apk](https://github.com/DesiM-collab/weave-builds/releases/download/android-latest/galaxy-continuity-debug.apk) |
| Mac (macOS 14+) | [GalaxyContinuity-mac.zip](https://github.com/DesiM-collab/weave-builds/releases/download/mac-latest/GalaxyContinuity-mac.zip) |
| Windows PC | [Weave-windows.msi](https://github.com/DesiM-collab/weave-builds/releases/download/windows-latest/Weave-windows.msi) |

## Set up

1. **Install.** Weave isn't in an app store, so each device asks once:
   * Phone: allow *Install unknown apps* for your browser, then install the APK.
   * Mac: drag Weave into Applications, open it, then System Settings → Privacy & Security → **Open Anyway**.
   * Windows: run the MSI; on "Windows protected your PC", click **More info** → **Run anyway**.
2. **Phone first run:** allow notifications, optionally notification access, and set battery to **Unrestricted**.
3. **Pair:** on the computer click **Pair phone**; on the phone tap **Scan pairing code** and scan it. Same Wi-Fi, once per computer. Pair both a Mac and a PC and they link to each other automatically.
4. **Turn on features** in the phone app's Settings as you want them. Remote control of a Mac needs Weave allowed under **Screen Recording** and **Accessibility** in System Settings.

## Connect from anywhere (optional)

Deploy your own relay to your free Cloudflare account, then paste its address into
Weave → Settings → **Internet relay** on each computer and connect the phone once on Wi-Fi.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/DesiM-collab/weave-builds/tree/main/relay)

The relay only passes encrypted data and can't read it. Personal use fits Cloudflare's free plan.
