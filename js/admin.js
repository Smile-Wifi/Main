// js/admin.js

// Convert file to Base64 for GitHub upload
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Upload media file to GitHub via Netlify Function
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

  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();

  if (!data.url) throw new Error("No URL returned from upload function");
  return data.url;
}

// Handle form submission
document.getElementById("news-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const file = document.getElementById("media").files[0];
  const status = document.getElementById("status");

  if (!title || !content) {
    alert("⚠️ Please enter a title and content before submitting.");
    return;
  }

  status.textContent = "⏳ Uploading...";
  try {
    let mediaUrl = null;
    if (file) {
      status.textContent = "⏫ Uploading media...";
      mediaUrl = await uploadToGitHub(file);
    }

    const newPost = {
      title,
      content,
      mediaUrl,
      date: new Date().toISOString(),
    };

    status.textContent = "💾 Saving post...";
    const res = await fetch("/.netlify/functions/update-news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPost }),
    });

    if (!res.ok) throw new Error("Failed to save news post");

    status.textContent = "✅ News added successfully!";
    e.target.reset();
  } catch (err) {
    console.error(err);
    status.textContent = "❌ " + err.message;
    alert("Error: " + err.message);
  }
});
