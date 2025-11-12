    const hamburger = document.getElementById("hamburger");
    const sidePanel = document.getElementById("side-panel");
    const closeBtn = document.getElementById("close-panel");
    const overlay = document.getElementById("overlay");

    hamburger.onclick = () => {
      sidePanel.classList.add("open");
      overlay.classList.add("show");
    };
    closeBtn.onclick = overlay.onclick = () => {
      sidePanel.classList.remove("open");
      overlay.classList.remove("show");
    };

    const songs = [
      { title: "Track 1", artist: "Artist", file: "https://resonant-hotteok-a33564.netlify.app/media/videos/SPOTIFY/track1.mp3", cover: "album.png" },
      { title: "Track 2", artist: "Artist", file: "https://resonant-hotteok-a33564.netlify.app/media/videos/SPOTIFY/track2.mp3", cover: "album.png" },
      { title: "Track 3", artist: "Artist", file: "https://resonant-hotteok-a33564.netlify.app/media/videos/SPOTIFY/track3.mp3", cover: "album.png" },
      { title: "Track 4", artist: "Artist", file: "https://resonant-hotteok-a33564.netlify.app/media/videos/SPOTIFY/track4.mp3", cover: "album.png" },
      { title: "Track 5", artist: "Artist", file: "https://resonant-hotteok-a33564.netlify.app/media/videos/SPOTIFY/track5.mp3", cover: "album.png" },
      { title: "Track 6", artist: "Artist", file: "https://resonant-hotteok-a33564.netlify.app/media/videos/SPOTIFY/track6.mp3", cover: "album.png" },
      { title: "Track 7", artist: "Artist", file: "https://resonant-hotteok-a33564.netlify.app/media/videos/SPOTIFY/track7.mp3", cover: "album.png" },
      { title: "Track 8", artist: "Artist", file: "https://resonant-hotteok-a33564.netlify.app/media/videos/SPOTIFY/track8.mp3", cover: "album.png" },
      { title: "Track 9", artist: "Artist", file: "https://resonant-hotteok-a33564.netlify.app/media/videos/SPOTIFY/track9.mp3", cover: "album.png" },
      { title: "Track 10", artist: "Artist", file: "https://resonant-hotteok-a33564.netlify.app/media/videos/SPOTIFY/track10.mp3", cover: "album.png" },
    ];

    const songList = document.getElementById("song-list");
    const playerCover = document.getElementById("player-cover");
    const playBtn = document.getElementById("play");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const progressBar = document.getElementById("progress-bar");
    const currentTimeEl = document.getElementById("current-time");
    const durationEl = document.getElementById("duration");
    const volumeControl = document.getElementById("volume");

    let currentSongIndex = 0;
    let audio = new Audio();
    let isPlaying = false;

    function renderSongs() {
      songList.innerHTML = songs
        .map((song, i) => `
          <div class="song-item" data-index="${i}">
            <img src="${song.cover}" alt="">
            <div class="song-info">
              <div class="song-title">${song.title}</div>
              <div class="song-artist">${song.artist}</div>
            </div>
            <i class="fas fa-play"></i>
          </div>
        `).join("");

      document.querySelectorAll(".song-item").forEach((item) => {
        item.addEventListener("click", () => {
          playSong(parseInt(item.dataset.index));
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
      playBtn.classList.replace("fa-play", "fa-pause");
    }

    playBtn.addEventListener("click", () => {
      if (!isPlaying) {
        audio.play();
        isPlaying = true;
        playBtn.classList.replace("fa-play", "fa-pause");
      } else {
        audio.pause();
        isPlaying = false;
        playBtn.classList.replace("fa-pause", "fa-play");
      }
    });

    prevBtn.addEventListener("click", () => {
      currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      playSong(currentSongIndex);
    });

    nextBtn.addEventListener("click", () => {
      currentSongIndex = (currentSongIndex + 1) % songs.length;
      playSong(currentSongIndex);
    });

    audio.addEventListener("ended", () => {
      nextBtn.click(); // auto-next when song ends
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
