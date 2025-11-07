const songs = [
  { title: "3 am West End", artist: "FreePD", file: "songs/3amWestEnd.mp3", cover: "covers/cover1.jpg" },
  { title: "A Good Bass for Gambling", artist: "FreePD", file: "songs/BassGambling.mp3", cover: "covers/cover2.jpg" },
  { title: "A Surprising Encounter", artist: "FreePD", file: "songs/Encounter.mp3", cover: "covers/cover3.jpg" },
  { title: "A Very Brady Special", artist: "FreePD", file: "songs/BradySpecial.mp3", cover: "covers/cover4.jpg" },
  { title: "A Waltz For Naseem", artist: "FreePD", file: "songs/WaltzNaseem.mp3", cover: "covers/cover5.jpg" },
];

const songList = document.getElementById("song-list");
const playerCover = document.getElementById("player-cover");
const playBtn = document.getElementById("play");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeControl = document.getElementById("volume");

let currentSongIndex = 0;
let audio = new Audio();
let isPlaying = false;

function renderSongs() {
  songList.innerHTML = songs
    .map(
      (song, i) => `
    <div class="song-item" data-index="${i}">
      <img src="${song.cover}" alt="">
      <div class="song-info">
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
      </div>
      <div class="song-time">0:00</div>
      <button class="add-btn"><i class="fas fa-plus"></i></button>
    </div>`
    )
    .join("");

  document.querySelectorAll(".song-item").forEach((item) => {
    item.addEventListener("click", () => {
      const index = parseInt(item.dataset.index);
      playSong(index);
    });
  });
}

function playSong(index) {
  currentSongIndex = index;
  const song = songs[index];
  audio.src = song.file;
  playerCover.src = song.cover;
  audio.play();
  isPlaying = true;
  playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
}

playBtn.addEventListener("click", () => {
  if (!isPlaying) {
    audio.play();
    isPlaying = true;
    playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
  } else {
    audio.pause();
    isPlaying = false;
    playBtn.innerHTML = `<i class="fas fa-play"></i>`;
  }
});

audio.addEventListener("timeupdate", () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress || 0;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

progressBar.addEventListener("input", () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value;
});

function formatTime(time) {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

renderSongs();
