const playBtn = document.getElementById("play-button");
const faIcon = document.getElementById("play-song");
const heartLike = document.getElementById("heart-like");
const heartIcon = document.getElementById("heartIcon");
const forwardBtn = document.getElementById("forward-btn");
const songName = document.querySelector(".song-title");
const artistName = document.querySelector(".artist-name");
const backgroundImg = document.getElementById("background-img");
const imageContainer = document.querySelector(".cover");
const shufIcon = document.getElementById("shuffle-icon");
const repeatBtn = document.getElementById("repeat-btn");
const durationBar = document.querySelector(".duration-bar");
const currentTime = document.querySelector(".current-time");
const songDuration = document.querySelector(".song-duration");
const bkwrdBtn = document.getElementById("backward-btn");
const fwrdBtn = document.getElementById("forward-btn");
const volumSlider = document.querySelector(".vol-range");
const volumeBtn = document.getElementById("btn-vol");
const volumArea = document.querySelector(".volume-range");

const music_list = [
  {
    title: "Flower",
    artist: "Jisoo",
    imgcover: "/assets/tracks/flower/image3.jpg",
    imgbackground: "/assets/tracks/flower/bg3.jpg",
    song: "/assets/tracks/flower/flower.mp3",
  },
  {
    title: "Ghost",
    artist: "Justin Bieber",
    imgcover: "/assets/tracks/ghost/image1.jpg",
    imgbackground: "/assets/tracks/ghost/bg1.png",
    song: "/assets/tracks/ghost/ghost.mp3",
  },
  {
    title: "Alone",
    artist: "Alan Walker",
    imgcover: "/assets/tracks/alone/image2.jpg",
    imgbackground: "/assets/tracks/alone/bg2.jpg",
    song: "/assets/tracks/alone/alone.mp3",
  },
  {
    title: "Jaded",
    artist: "Miley Cyrus",
    imgcover: "/assets/tracks/jaded/image4.jpg",
    imgbackground: "/assets/tracks/jaded/bg4.jpg",
    song: "/assets/tracks/jaded/jaded.mp3",
  },
  {
    title: "Speechless",
    artist: "Robin Schulz",
    imgcover: "/assets/tracks/speechless/image5.jpg",
    imgbackground: "/assets/tracks/speechless/bg5.jpg",
    song: "/assets/tracks/speechless/speechless.mp3",
  },
];

heartLike.addEventListener("click", () => {
  if (heartIcon.classList.contains("fa-regular")) {
    heartIcon.classList.remove("fa-regular");
    heartIcon.classList.add("fa-solid");
  } else {
    heartIcon.classList.remove("fa-solid");
    heartIcon.classList.add("fa-regular");
  }
});

let trackIndex = 0;
let isPlaying = false;
let updateTimer;
let currentTrack = document.createElement("audio");
let isShuffled = false;

function loadTrack(trackIndex) {
  clearInterval(updateTimer);

  currentTrack.src = music_list[trackIndex].song;
  currentTrack.load();

  updateTimer = setInterval(() => {
    durationUpdate();
  }, 1000);

  songName.textContent = music_list[trackIndex].title;
  artistName.textContent = music_list[trackIndex].artist;
  backgroundImg.src = music_list[trackIndex].imgbackground;
  imageContainer.innerHTML = `<img src= ${music_list[trackIndex].imgcover} class="picture" />`;

  currentTrack.addEventListener("ended", nextSong);
}

function durationUpdate() {
  let seekPosition = 0;

  seekPosition = currentTrack.currentTime * (100 / currentTrack.duration);
  durationBar.value = seekPosition;

  let durationMinutes = Math.floor(currentTrack.duration / 60);
  let durationSeconds = Math.floor(
    currentTrack.duration - durationMinutes * 60
  );
  songDuration.textContent = durationMinutes + ":" + durationSeconds;
  let currentMinutes = Math.floor(currentTrack.currentTime / 60);
  let currentSeconds = Math.floor(
    currentTrack.currentTime - currentMinutes * 60
  );

  if (currentSeconds < 10) {
    currentSeconds = "0" + currentSeconds;
  }
  if (durationSeconds < 10) {
    durationSeconds = "0" + durationSeconds;
  }
  if (currentMinutes < 10) {
    currentMinutes = "0" + currentMinutes;
  }
  if (durationMinutes < 10) {
    durationMinutes = "0" + durationMinutes;
  }

  currentTime.textContent = currentMinutes + ":" + currentSeconds;
  songDuration.textContent = durationMinutes + ":" + durationSeconds;
}

function playPauseTrack() {
  if (!isPlaying && !isShuffled) {
    playTrack();
  } else {
    pauseTrack();
  }
}

function playTrack() {
  currentTrack.play();
  isPlaying = true;
  playBtn.innerHTML = `<i
  class="fa-sharp fa-solid fa-circle-pause fa-shared"
  id="play-song"></i>`;
}

function pauseTrack() {
  currentTrack.pause();
  isPlaying = false;
  playBtn.innerHTML = `<i
  class="fa-sharp fa-solid fa-circle-play fa-shared"
  id="play-song"></i>`;
}

const randomTrack = () => {
  let randomNum = Math.floor(Math.random() * music_list.length);
  currentTrack.src = music_list[randomNum].song;
  songName.textContent = music_list[randomNum].title;
  artistName.textContent = music_list[randomNum].artist;
  backgroundImg.src = music_list[randomNum].imgbackground;
  imageContainer.innerHTML = `<img src= ${music_list[randomNum].imgcover} class="picture" />`;
  isShuffled = false;
  playTrack();
};

function resetValues() {
  currentTime.textContent = "00:00";
  songDuration.textContent = "00:00";
  durationBar.value = 0;
}

function nextSong() {
  if (trackIndex < music_list.length - 1) {
    trackIndex++;
  } else {
    trackIndex = 0;
  }

  loadTrack(trackIndex);
  playTrack();
}

function previousSong() {
  if (trackIndex > 0) {
    trackIndex--;
  } else {
    trackIndex = trackIndex < music_list.length - 1;
  }
  loadTrack(trackIndex);
  playTrack();
}

function seekTo() {
  seekto = currentTrack.duration * (durationBar.value / 100);

  currentTrack.currentTime = seekto;
}

playBtn.addEventListener("click", playPauseTrack);

shufIcon.addEventListener("click", randomTrack);

repeatBtn.addEventListener("click", () => {
  currentTrack.currentTime = 0;
});

volumeBtn.addEventListener("mouseenter", () => {
  let lastValue = localStorage.getItem("volume") || 0;

  const volumInput = document.createElement("input");
  volumInput.type = "range";
  volumInput.min = "0";
  volumInput.max = "100";
  volumInput.value = lastValue;
  volumInput.classList.add("vol-range");

  volumInput.addEventListener("input", () => {
    changeVolume(volumInput);
  });

  volumArea.appendChild(volumInput);

  volumeBtn.addEventListener("mouseleave", () => {
    localStorage.setItem("volume", volumInput.value);
    volumInput.classList.remove("vol-range");
    volumInput.remove();
  });
});

function changeVolume(volumInput) {
  currentTrack.volume = volumInput.value / 100;
}

fwrdBtn.addEventListener("click", nextSong);

bkwrdBtn.addEventListener("click", previousSong);

loadTrack(trackIndex);

/* 

Code I wrote but did not used...took 4 days...don't give up :) 

let selectedTrack = new Audio(music_list[trackIndex].song);
let isPlaying = false;
let isFirstPlay = true;
let isShuffled = false;

const trackInfo = () => {
  songName.textContent = music_list[trackIndex].title;
  artistName.textContent = music_list[trackIndex].artist;
  backgroundImg.src = music_list[trackIndex].imgbackground;
  imageContainer.innerHTML = `<img src= ${music_list[trackIndex].imgcover} class="picture" />`;
};

const playTrack = () => {
  selectedTrack = new Audio(music_list[trackIndex].song);
  selectedTrack.play();
  faIcon.classList.remove("fa-circle-play");
  faIcon.classList.add("fa-circle-pause");
  trackInfo();
};

const pauseTrack = () => {
  selectedTrack.pause();
  faIcon.classList.remove("fa-circle-pause");
  faIcon.classList.add("fa-circle-play");
  trackInfo();
};

const randomTrack = () => {
  pauseTrack();
  let randomNum = Math.floor(Math.random() * music_list.length);

  selectedTrack.src = music_list[randomNum].song;
  faIcon.classList.remove("fa-circle-play");
  faIcon.classList.add("fa-circle-pause");
  songName.textContent = music_list[randomNum].title;
  artistName.textContent = music_list[randomNum].artist;
  backgroundImg.src = music_list[randomNum].imgbackground;
  imageContainer.innerHTML = `<img src= ${music_list[randomNum].imgcover} class="picture" />`;
  isShuffled = true;
  selectedTrack.play();
};

playBtn.addEventListener("click", function () {
  if (!isPlaying) {
    playTrack();
    if (isFirstPlay && !isShuffled) {
      trackInfo();
    }
    isPlaying = true;
  } else {
    pauseTrack();
    isPlaying = false;
  }
});

heartLike.addEventListener("click", () => {
  if (heartIcon.classList.contains("fa-regular")) {
    heartIcon.classList.remove("fa-regular");
    heartIcon.classList.add("fa-solid");
  } else {
    heartIcon.classList.remove("fa-solid");
    heartIcon.classList.add("fa-regular");
  }
});

shufIcon.addEventListener("click", randomTrack);

repeatBtn.addEventListener("click", () => {
  selectedTrack.currentTime = 0;
});

fwrdBtn.addEventListener("click", () => {
  pauseTrack();

  if (trackIndex < music_list.length - 1) {
    trackIndex++;
  } else {
    trackIndex = 0;
  }

  playTrack();
});

bkwrdBtn.addEventListener("click", () => {
  pauseTrack();

  if (trackIndex > 0) {
    trackIndex--;
  } else {
    trackIndex = trackIndex < music_list.length - 1;
  }

  playTrack();
});
 */
