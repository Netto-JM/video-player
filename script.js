const player = document.querySelector('.player');
const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const fullscreenBtn = document.querySelector('.fullscreen');
const fullscreenIcon = document.getElementById('fullscreen-icon');
const speed = document.querySelector('.player-speed');

// Play & Pause ----------------------------------- //

function showPlayIcon() {
  playBtn.classList.replace('fa-pause', 'fa-play');
  playBtn.setAttribute('title', 'Play');
}

function togglePlay() {
  if (video.paused) {
    video.play();
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
  } else {
    video.pause();
    showPlayIcon();
  }
}

// Progress Bar ---------------------------------- //

function calculateDisplayTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = (`0${Math.floor(time % 60)}`).slice(-2);
  return `${minutes}:${seconds}`;
}

function updateProgress() {
  progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
  currentTime.textContent = `${calculateDisplayTime(video.currentTime)} /`;
}

// Click to seek within the video
function setProgress(e) {
  const newTime = (e.offsetX / progressRange.offsetWidth) * video.duration;
  video.currentTime = newTime;
}

// Volume Controls --------------------------- //

function updateVolumeBarAndIcon() {
  volumeBar.style.width = `${video.volume * 100}%`;
  const oldIcon = volumeIcon.className.slice(4);
  const oldTitle = volumeIcon.getAttribute('title');
  let newIcon = '';
  let newTitle = '';
  
  if (video.volume === 0) {
    newIcon = 'fa-volume-mute';
    newTitle = 'Unmute';
  } else if (video.volume <= 0.66) {
    newIcon = 'fa-volume-down';
    newTitle = 'Mute';
  } else {
    newIcon = 'fa-volume-up';
    newTitle = 'Mute';
  }

  if (oldIcon !== newIcon) {
    volumeIcon.classList.replace(oldIcon, newIcon);
  }

  if (oldTitle !== newTitle) {
    volumeIcon.setAttribute('title', newTitle);
  }
}

function changeVolume(e) {
  const volume = e.offsetX / volumeRange.offsetWidth;
  video.volume = volume < 0.1 ? 0 : volume > 0.9 ? 1 : volume;
}

const toggleMute = function () {
  let volumeBefore = NaN;
  return function () {
    if (isNaN(volumeBefore)) {
      volumeBefore = video.volume;
    }
    const volumeActual = video.volume;
    video.volume = volumeActual != 0 ? 0 : volumeBefore === 0 ? 1 : volumeBefore;
    volumeBefore = volumeActual;
  };
}();

// Fullscreen ------------------------------- //

const toggleFullscreen = function () {
  const fullscreenElement = document.fullscreenElement ? 'fullscreenElement' : 
  document.webkitFullscreenElement ? 'webkitFullscreenElement' : 'msFullscreenElement';
  const openFullscreen = player.requestFullscreen || player.webkitRequestFullscreen || player.msRequestFullscreen;
  const closeFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
  return function () {
    document[fullscreenElement] ? closeFullscreen.call(document) : openFullscreen.call(player);
  };
}();

function styleFullscreen () {
  const onFullscreenMode = Boolean(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
  if (onFullscreenMode) {
    fullscreenIcon.classList.replace('fa-expand', 'fa-compress');
    fullscreenIcon.setAttribute('title', 'Exit fullscreen');
  } else {
    fullscreenIcon.classList.replace('fa-compress', 'fa-expand');
    fullscreenIcon.setAttribute('title', 'Fullscreen');
  }
  video.classList.toggle('video-fullscreen', onFullscreenMode);
}

// Event Listenners
playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('ended', showPlayIcon);
video.addEventListener('canplay', () => {duration.textContent = calculateDisplayTime(video.duration);});
video.addEventListener('timeupdate', updateProgress);
video.addEventListener("volumechange", updateVolumeBarAndIcon);
speed.addEventListener('change', () => {video.playbackRate = speed.value;});
progressRange.addEventListener('click', setProgress);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
fullscreenBtn.addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', styleFullscreen);
document.addEventListener('webkitfullscreenchange', styleFullscreen);
document.addEventListener('MSFullscreenChange', styleFullscreen);