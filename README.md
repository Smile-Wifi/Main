📡 Smile Wifi — Offline Local Portal (PWA)

A lightweight, offline-optimized intranet portal designed for local networks, cafés, and campus WiFi systems.
Smile Wifi serves cached content, local apps, media, tools, and entertainment — all inside a visually modern UI with video backgrounds, sliders, and a full PWA setup.

🚀 Features
🎬 Cinematic UI

Fullscreen looping video background

Animated welcome overlay with intro sound

Smooth transitions and clean layout

📱 Mobile-Friendly

Fully responsive

Icon slider with touch + keyboard navigation

Bottom carousel for quick navigation

📦 Local Apps Integration

Includes support for:

CampusDC

SmileFlix

PublicDoc

Musify

Sports

Jollibee

Freedom

Wikipedia (external)

LocalBiz

AWDT

Politics

eBooks

HBO / Smile Movies

SmileNews

SAGA
(And many more via the All-Apps grid)

🔧 PWA Ready

manifest.json

Service Worker (sw.js)

Offline cache support

Works on intranet with no internet connection

🎥 Local Media Player

Auto-play local advertisements or videos

Muted welcome before activation

Beautiful minimal player box

🔍 Central Search Box

Centered search input for local search engine or client script.

📂 All Apps Overlay

Dynamic grid populated by JS

Smooth open/close

Blur + dark mode overlay

📜 Side Navigation Menu

Admin Panel

Advertising link

Weather

Games

Earthquake Login

About

APK Download link

🛠️ Project Structure
/
├── index.html
├── sw.js
├── manifest.json
├── media/
│   ├── background/
│   ├── icons/
│   ├── GIF/
│   └── video-player/
├── audio/
│   └── intro.mp3
├── pages/
│   └── root/
│       └── (All apps & portals)
└── news/

🌐 Hosting on GitHub Pages

Upload all files to your GitHub repo

Go to Settings → Pages

Select branch: main

Folder: root (/)

Save — your website will appear at: