// netlify/functions/update-news.js
import fetch from "node-fetch";

export async function handler(event) {
  try {
    const GITHUB_USER = "Smile-Wifi";
    const GITHUB_REPO = "Main";
    const GITHUB_BRANCH = "main";
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/data/news.json`;

    const body = JSON.parse(event.body || "{}");
    const { newPost } = body;

    if (!newPost) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing newPost in request body" }),
      };
    }

    // Get current news.json file
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });

    if (!getRes.ok) {
      throw new Error(`Failed to fetch news.json (${getRes.status})`);
    }

    const getData = await getRes.json();
    const oldContent = Buffer.from(getData.content, "base64").toString("utf8");
    let newsArray = [];

    try {
      newsArray = JSON.parse(oldContent);
      if (!Array.isArray(newsArray)) newsArray = [];
    } catch {
      newsArray = [];
    }

    // Add new post to top
    newsArray.unshift(newPost);

    const updatedContent = Buffer.from(
      JSON.stringify(newsArray, null, 2)
    ).toString("base64");

    // Commit updated JSON to GitHub
    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add post: ${newPost.title}`,
        content: updatedContent,
        sha: getData.sha,
        branch: GITHUB_BRANCH,
      }),
    });

    const putData = await putRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, commit: putData.commit?.sha }),
    };
  } catch (err) {
    console.error("update-news error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
