export async function handler(event) {
  try {
    const { newPost } = JSON.parse(event.body || "{}");
    if (!newPost) return { statusCode: 400, body: JSON.stringify({ error: "Missing newPost" }) };

    const GITHUB_USER = "Smile-Wifi";
    const GITHUB_REPO = "Main";
    const GITHUB_BRANCH = "main";
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/news/data/news.json`;

    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const getData = await getRes.json();

    let news = [];
    if (getData.content) {
      const existing = Buffer.from(getData.content, "base64").toString();
      try { news = JSON.parse(existing); } catch {}
    }
    news.unshift(newPost);

    const updated = Buffer.from(JSON.stringify(news, null, 2)).toString("base64");

    const res = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Update news.json",
        content: updated,
        branch: GITHUB_BRANCH,
        sha: getData.sha
      })
    });

    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify({ success: true, details: data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
