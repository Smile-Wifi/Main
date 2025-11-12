// js/admin.js

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadToGitHub(file) {
  const base64 = await fileToBase64(file);
  const fileName = `${Date.now()}_${file.name}`;
  const res = await fetch("/.netlify/functions/upload-to-github", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName,
      fileContent: base64.split(",")[1],
    }),
  });
  const data = await res.json();
  return data.url;
}

document.getElementById("news-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const file = document.getElementById("media").files[0];

  let mediaUrl = null;
  if (file) mediaUrl = await uploadToGitHub(file);

  const newPost = {
    title,
    content,
    mediaUrl,
    date: new Date().toISOString(),
  };

  await fetch("/.netlify/functions/update-news", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPost }),
  });

  alert("✅ News added!");
  e.target.reset();
});
