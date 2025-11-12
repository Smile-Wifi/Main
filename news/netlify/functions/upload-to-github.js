export async function handler(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const { fileName, fileContent } = body;
    if (!fileName || !fileContent)
      return { statusCode: 400, body: JSON.stringify({ error: "Missing fileName or fileContent" }) };

    const GITHUB_USER = "Smile-Wifi";
    const GITHUB_REPO = "Main";
    const GITHUB_BRANCH = "main";
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/news/upload/${fileName}`;

    const check = await fetch(apiUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const existing = check.ok ? await check.json() : {};
    const sha = existing.sha;

    const res = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Upload ${fileName}`,
        content: fileContent,
        branch: GITHUB_BRANCH,
        sha
      })
    });

    const data = await res.json();
    if (data.content?.download_url)
      return { statusCode: 200, body: JSON.stringify({ url: data.content.download_url }) };

    return { statusCode: 500, body: JSON.stringify({ error: "GitHub upload failed", details: data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
