// app.js
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const playModeBtn = document.getElementById('play-mode-btn');
const progressBar = document.getElementById('progress-bar');
const progressHandle = document.getElementById('progress-handle');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');

let isPlaying = false;
let currentSongIndex = 0;
let isShuffleMode = false;
let isRepeatOneMode = false;
let isDraggingProgress = false;

// const songs = [
  // {
  //   "id": 1,
  //   "title": "Loving You",
  //   "releaseDate": "2012-12-13",
  //   "artist": "Shanice Wilson",
  //   "file": "LovingYou-ShaniceWilson.mp3"
  // },
//   {
//     "id": 2,
//     "title": "My Heart Will Go On",
//     "releaseDate": "1998-12-20",
//     "artist": "Celine Dion"
//   },
//   {
//     "id": 3,
//     "title": "Nothing'S Gonna Change My Love",
//     "releaseDate": "1998-12-15",
//     "artist": "Dana Winner"
//   },
//   {
//     "id": 4,
//     "title": "Pretty Boy",
//     "releaseDate": "1994-3-15",
//     "artist": "M2M"
//   },
//   {
//     "id": 5,
//     "title": "Scarborough Fair",
//     "releaseDate": "1994-03-12",
//     "artist": "Sarah Brightman"
//   },
//   {
//     "id": 6,
//     "title": "Sealed With A Kiss",
//     "releaseDate": "1991-3-15",
//     "artist": "Dana Winner"
//   },

//   {
//     "id": 7,
//     "title": "Set Fire to the Rain",
//     "releaseDate": "2017-2-15",
//     "artist": "Adele"
//   },
//   {
//     "id": 8,
//     "title": "Someone Like You",
//     "releaseDate": "2014-9-18",
//     "artist": "Adele"
//   },
//   {
//     "id": 9,
//     "title": "Sound Of Silence",
//     "releaseDate": "2014-9-18",
//     "artist": "Ania"
//   },
//   {
//     "id": 10,
//     "title": "Stay",
//     "releaseDate": "1996-1-23",
//     "artist": "Tonya Mitchell"
//   },
//   {
//     "id": 11,
//     "title": "Still Crazy in Love",
//     "releaseDate": "2020-1-23",
//     "artist": "Sarah Connor"
//   },
//   {
//     "id": 12,
//     "title": "Still Loving You",
//     "releaseDate": "2020-1-23",
//     "artist": "Scorpions",
//     "url": "Still%20Loving%20You-Scorpions.mp3"
//   },
// ];

// const songs = [
//   {
//     title: 'Five Hundred Miles',
//     artist: 'Chinese Singer',
//     file: 'songs/song1.mp3'
//   },
//   {
//     title: 'Top of The World',
//     artist: 'LeeSuHyun',
//     file: 'songs/song2.mp3'
//   },
//   {
//     title: 'Top of The World',
//     artist: 'Original',
//     file: 'songs/song3.mp3'
//   }
// ];

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', playPreviousSong);
nextBtn.addEventListener('click', playNextSong);
playModeBtn.addEventListener('click', togglePlayMode);

let audio = new Audio();

function togglePlay(data) {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function playSong() {
  console.log("I am here")
  
  fetch('http://localhost:3000/LovingYou-ShaniceWilson.mp3')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch the audio file');
      }
      console.log(response)
      return response.blob();
    })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      console.log(audio)
      // audio.play();
    })
    .catch(error => {
      console.error(error);
    });

  if (audio.src !== songs[currentSongIndex].file) {
    audio.src = songs[currentSongIndex].file;
    songTitle.textContent = songs[currentSongIndex].title;
    artistName.textContent = songs[currentSongIndex].artist;
  }

  audio.addEventListener('loadedmetadata', () => {
    updateDurationDisplay();
  });

  audio.play();
  isPlaying = true;
  playBtn.classList = 'fa fa-pause';
  updateProgressBar();
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.classList = 'fa fa-play';
}

function playPreviousSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong();
}

function playNextSong() {
  if (isShuffleMode) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentSongIndex);
    currentSongIndex = randomIndex;
  } else {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
  }
  playSong();
}

function togglePlayMode() {
  if (isShuffleMode) {
    isShuffleMode = false;
    isRepeatOneMode = false;
    playModeBtn.classList = 'fa fa-refresh';
  } else if (isRepeatOneMode) {
    isShuffleMode = true;
    isRepeatOneMode = false;
    playModeBtn.classList = 'fa fa-random';
  } else {
    isShuffleMode = false;
    isRepeatOneMode = true;
    playModeBtn.classList = 'fa fa-repeat';
  }

  playModeBtn.classList.toggle('active');
}

function updateProgressBar() {
  const progress = (audio.currentTime / audio.duration) * 100;
  if (isNaN(progress)) {
    progressBar.value = 0;
    progressHandle.style.left = '0%';
  } else {
    progressBar.value = progress;
    progressHandle.style.left = `${progress}%`;
  }
}

function updateDurationDisplay() {
  const durationMinutes = Math.floor(audio.duration / 60);
  const durationSeconds = Math.floor(audio.duration % 60);
  durationDisplay.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
}

function updateCurrentTimeDisplay() {
  const currentTimeMinutes = Math.floor(audio.currentTime / 60);
  const currentTimeSeconds = Math.floor(audio.currentTime % 60);
  currentTimeDisplay.textContent = `${currentTimeMinutes}:${currentTimeSeconds < 10 ? '0' : ''}${currentTimeSeconds}`;
}

audio.addEventListener('timeupdate', () => {
  updateProgressBar();
  updateCurrentTimeDisplay();

  if (audio.currentTime === audio.duration) {
    if (isRepeatOneMode) {
      playSong();
    } else if (isShuffleMode) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (randomIndex === currentSongIndex);
      currentSongIndex = randomIndex;
      playSong();
    } else {
      playNextSong();
    }
  }
});

progressBar.addEventListener('mousedown', () => {
  isDraggingProgress = true;
});

document.addEventListener('mousemove', (event) => {
  if (isDraggingProgress) {
    const progressBarRect = progressBar.getBoundingClientRect();
    const progressWidth = event.clientX - progressBarRect.left;
    const progressBarWidth = progressBarRect.width;
    const progressPercentage = (progressWidth / progressBarWidth) * 100;

    progressBar.value = progressPercentage;
    progressHandle.style.left = `${progressPercentage}%`;
  }
});

document.addEventListener('mouseup', (event) => {
  if (isDraggingProgress) {
    isDraggingProgress = false;
    const progressBarRect = progressBar.getBoundingClientRect();
    const clickPosition = event.clientX - progressBarRect.left;
    const progressBarWidth = progressBarRect.width;
    const seekPercentage = clickPosition / progressBarWidth;
    const seekTime = seekPercentage * audio.duration;

    audio.currentTime = seekTime;
    if (isPlaying) {
      audio.play();
    }
  }
});
