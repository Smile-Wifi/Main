// netlify/functions/upload-to-github.js
import fetch from "node-fetch";

export async function handler(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const { fileName, fileContent } = body;

    if (!fileName || !fileContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing fileName or fileContent" }),
      };
    }

    // 🔧 CHANGE THESE IF YOU EVER RENAME YOUR REPO OR BRANCH
    const GITHUB_USER = "Smile-Wifi";
    const GITHUB_REPO = "Main";
    const GITHUB_BRANCH = "main";
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    // Upload to /news/uploads/
    const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/news/uploads/${fileName}`;

    const res = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Upload ${fileName}`,
        content: fileContent, // base64 file data
        branch: GITHUB_BRANCH,
      }),
    });

    const data = await res.json();

    if (data.content && data.content.download_url) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          url: data.content.download_url, // ✅ public GitHub URL
        }),
      };
    } else {
      console.error("GitHub upload error:", data);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "GitHub upload failed",
          details: data,
        }),
      };
    }
  } catch (err) {
    console.error("upload-to-github error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
