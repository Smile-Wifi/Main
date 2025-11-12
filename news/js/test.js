// js/main.js

async function loadNews() {
  const res = await fetch("https://raw.githubusercontent.com/Smile-Wifi/Main/main/data/news.json");
  const news = await res.json();
  const container = document.getElementById("news-container");
  container.innerHTML = "";

  news.forEach(item => {
    const div = document.createElement("div");
    div.className = "news-item";
    div.innerHTML = `
      <h2>${item.title}</h2>
      <p>${item.content}</p>
      ${item.mediaUrl
        ? item.mediaUrl.endsWith(".mp4")
          ? `<video controls src="${item.mediaUrl}"></video>`
          : `<img src="${item.mediaUrl}" alt="${item.title}">`
        : ""}
      <small>${new Date(item.date).toLocaleString()}</small>
    `;
    container.appendChild(div);
  });
}

loadNews();
