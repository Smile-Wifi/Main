const $ = s => document.querySelector(s);

const iframe = $('#frame');
const urlDisplay = $('#url-display');
const searchInput = $('#search-input');
const searchForm = $('#search-form');
const googleHome = $('#google-home');
const trendingList = $('#trending-list');

const backBtn = $('#back'), bmBtn = $('#bm'), menuBtn = $('#menu');
const bhome = $('#bhome'), bsearch = $('#bsearch'), bmore = $('#bmore');

let history = JSON.parse(localStorage.getItem('miniHistory') || '[]');
let bookmarks = JSON.parse(localStorage.getItem('miniBookmarks') || '[]');
let navIndex = -1;
let currentUrl = '';

// ——————————————————————————————————————
// EDIT TRENDING SEARCHES HERE (EASY!)
const TRENDING_SEARCHES = [
  { text: "weather forecast super typhoon uwan", query: "weather forecast super typhoon uwan" },
  { text: "japan earthquakes", query: "japan earthquakes" },
  { text: "lotto results grand lotto", query: "lotto results grand lotto" },
  { text: "philippine airlines cancelled flights", query: "philippine airlines cancelled flights" },
  { text: "today wordle hints", query: "today wordle hints" }
];
// ——————————————————————————————————————

function renderTrending() {
  trendingList.innerHTML = '';
  TRENDING_SEARCHES.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="trend-icon">Trend</span> ${item.text}`;
    li.onclick = () => {
      searchInput.value = item.query;
      searchForm.dispatchEvent(new Event('submit'));
    };
    trendingList.appendChild(li);
  });
}

// Show/Hide Home
function showHome() {
  googleHome.style.display = 'flex';
  iframe.style.display = 'none';
  urlDisplay.textContent = 'google.com';
  currentUrl = '';
  bhome.classList.add('active');
  bsearch.classList.remove('active');
  updateNavButtons();
  renderTrending();
}
function hideHome() {
  googleHome.style.display = 'none';
  iframe.style.display = 'block';
  bhome.classList.remove('active');
  bsearch.classList.add('active');
}

// Navigate
function navigateTo(url) {
  if (!url.startsWith('http')) url = 'https://' + url;
  hideHome();
  iframe.src = url;
  currentUrl = url;
  const display = new URL(url).hostname;
  urlDisplay.textContent = display;

  if (history[navIndex] !== url) {
    history = history.slice(0, navIndex + 1);
    history.push(url);
    navIndex++;
    localStorage.setItem('miniHistory', JSON.stringify(history));
  }
  renderHistory();
}

// Iframe load
iframe.onload = () => {
  try {
    const loc = iframe.contentWindow.location;
    if (loc.href !== 'about:blank') {
      currentUrl = loc.href;
      urlDisplay.textContent = loc.hostname;
    }
  } catch (e) {}
  updateNavButtons();
};

// Search
searchForm.onsubmit = e => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if (!q) return;
  if (q.includes('.')) navigateTo(q);
  else navigateTo('https://www.google.com/search?q=' + encodeURIComponent(q));
};

// Buttons
backBtn.onclick = () => {
  if (navIndex > 0) { navIndex--; iframe.src = history[navIndex]; }
};
bhome.onclick = showHome;
bmBtn.onclick = toggleBookmark;
menuBtn.onclick = () => toggleDrawer('#menu-drawer');
bmore.onclick = () => toggleDrawer('#menu-drawer');

// Bookmark
function toggleBookmark() {
  const i = bookmarks.indexOf(currentUrl);
  if (i === -1 && currentUrl) bookmarks.push(currentUrl);
  else if (i !== -1) bookmarks.splice(i, 1);
  localStorage.setItem('miniBookmarks', JSON.stringify(bookmarks));
  renderBookmarks();
}

// Render
function renderBookmarks() {
  const list = $('#bmlist');
  list.innerHTML = '';
  bookmarks.forEach(url => {
    const li = document.createElement('li');
    li.textContent = url;
    li.onclick = () => navigateTo(url);
    list.appendChild(li);
  });
}
function renderHistory() {
  const list = $('#histlist');
  list.innerHTML = '';
  history.slice().reverse().forEach(url => {
    const li = document.createElement('li');
    li.textContent = url;
    li.onclick = () => navigateTo(url);
    list.appendChild(li);
  });
}

// Drawers
function toggleDrawer(id) { $(id).classList.toggle('open'); }
$('#close-bm').onclick = () => $('#bookmarks').classList.remove('open');
$('#close-hist').onclick = () => $('#history').classList.remove('open');
$('#close-menu').onclick = () => $('#menu-drawer').classList.remove('open');
$('#clrHist').onclick = () => {
  history = []; navIndex = -1;
  localStorage.setItem('miniHistory', '[]');
  renderHistory();
};

// Dark mode
if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');
$('#dark-mode-toggle').onclick = () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
};

// Share, Find, Desktop
$('#share-page').onclick = async () => {
  if (navigator.share && currentUrl) await navigator.share({url: currentUrl});
  else if (currentUrl) { await navigator.clipboard.writeText(currentUrl); alert('Copied!'); }
};
$('#find-in-page').onclick = () => {
  const term = prompt('Find:');
  if (term) iframe.contentWindow.find(term);
};
$('#desktop-mode').onclick = () => {
  alert('Desktop mode: reload page in browser settings');
};

// Nav buttons
function updateNavButtons() {
  backBtn.disabled = navIndex <= 0;
}

// Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(console.error);
}

// Init
showHome();
renderBookmarks();
renderHistory();