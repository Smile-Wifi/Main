Main/
 ├─ index.html
 ├─ admin.html
 ├─ js/
 │   ├─ admin.js
 │   └─ main.js
 ├─ netlify/
 │   └─ functions/
 │       ├─ upload-to-github.js
 │       └─ update-news.js
 ├─ upload/
 └─ data/
     └─ news.json


✅ Option B — Pure Netlify + GitHub JSON CMS (🔥 Fully Firebase-free)

If you prefer to drop Firebase entirely (no auth, no billing risk), you can:

Store news data in a GitHub file: /data/news.json

Use Netlify Functions to read and write that file

Upload files to /upload/ just like now

This version is 100% free and works perfectly on Netlify.
Here’s exactly how you’d set it up 👇