// js/main.js

async function loadNews() {
  try {
    // ✅ Corrected path — points to your news/data folder
    const res = await fetch(
      "https://raw.githubusercontent.com/Smile-Wifi/Main/main/news/data/news.json?t=" + Date.now()
    );

    if (!res.ok) throw new Error("Failed to load news.json");

    const news = await res.json();
    const container = document.getElementById("news-container");
    container.innerHTML = "";

    if (!Array.isArray(news) || news.length === 0) {
      container.innerHTML = "<p>No news available yet.</p>";
      return;
    }

    news.forEach((item) => {
      const div = document.createElement("div");
      div.className = "news-item";
      div.innerHTML = `
        <h2>${item.title}</h2>
        <p>${item.content}</p>
        ${
          item.mediaUrl
            ? item.mediaUrl.endsWith(".mp4")
              ? `<video controls src="${item.mediaUrl}" style="max-width:100%;border-radius:8px;margin-top:10px;"></video>`
              : `<img src="${item.mediaUrl}" alt="${item.title}" style="max-width:100%;border-radius:8px;margin-top:10px;">`
            : ""
        }
        <small>${new Date(item.date).toLocaleString()}</small>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    const container = document.getElementById("news-container");
    container.innerHTML = `<p style="color:red;">Error loading news: ${err.message}</p>`;
    console.error(err);
  }
}

loadNews();
