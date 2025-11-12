// netlify/functions/update-news.js
import fetch from "node-fetch";

export async function handler(event) {
  try {
    // 🧭 Configuration
    const GITHUB_USER = "Smile-Wifi";
    const GITHUB_REPO = "Main";
    const GITHUB_BRANCH = "main";
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/news/news.json`;

    // 📨 Parse request body
    const body = JSON.parse(event.body || "{}");
    const { newPost } = body;

    if (!newPost) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing newPost in request body" }),
      };
    }

    // 🧾 Fetch existing news.json from GitHub
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });

    let newsArray = [];
    let sha = null;

    if (getRes.ok) {
      const getData = await getRes.json();
      sha = getData.sha;
      const content = Buffer.from(getData.content, "base64").toString("utf8");
      try {
        newsArray = JSON.parse(content);
        if (!Array.isArray(newsArray)) newsArray = [];
      } catch {
        newsArray = [];
      }
    } else if (getRes.status === 404) {
      // file doesn’t exist yet → create new one
      newsArray = [];
    } else {
      throw new Error(`Failed to fetch news.json (${getRes.status})`);
    }

    // 🆕 Add new post to the top
    newsArray.unshift(newPost);

    const updatedContent = Buffer.from(
      JSON.stringify(newsArray, null, 2)
    ).toString("base64");

    // 💾 Commit new JSON to GitHub
    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add post: ${newPost.title}`,
        content: updatedContent,
        sha, // existing file SHA (if present)
        branch: GITHUB_BRANCH,
      }),
    });

    const putData = await putRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        commit: putData.commit?.sha || null,
      }),
    };
  } catch (err) {
    console.error("update-news error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
