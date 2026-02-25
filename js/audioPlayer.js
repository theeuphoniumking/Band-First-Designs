document.querySelectorAll(".player").forEach(initPlayer);

function initPlayer(player) {
  const audio = player.querySelector(".js-audio");
  const playBtn = player.querySelector(".js-play");
  const progress = player.querySelector(".js-progress");
  const volume = player.querySelector(".js-volume");
  const currentTimeEl = player.querySelector(".js-current");
  const durationEl = player.querySelector(".js-duration");

  const volumeIconBtn = player.querySelector(".js-volumeIcon");
  const volumeIcon = player.querySelector(".js-volumeIconSymbol");

  let isPlaying = false;
  let lastVolume = 1;

  function formatTime(time) {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function loadDuration() {
    if (isFinite(audio.duration) && audio.duration > 0) {
      durationEl.textContent = formatTime(audio.duration);
      progress.max = audio.duration;
    }
  }

  function updateVolumeIcon() {
    const v = Number(volume.value);
    if (v === 0) volumeIcon.textContent = "no_sound";     // speaker only
    else if (v <= 0.5) volumeIcon.textContent = "volume_down"; // one wave
    else volumeIcon.textContent = "volume_up";               // two waves
  }

  // Make sure metadata loads
  audio.addEventListener("loadedmetadata", loadDuration);
  audio.addEventListener("canplay", loadDuration);
  audio.addEventListener("loadeddata", loadDuration);
  audio.load();

  // Play / Pause (handle autoplay restrictions safely)
  playBtn.addEventListener("click", async () => {
    try {
      if (!isPlaying) {
        await audio.play();
        playBtn.textContent = "⏸";
        isPlaying = true;
      } else {
        audio.pause();
        playBtn.textContent = "▶";
        isPlaying = false;
      }
    } catch (err) {
      console.error("Play failed:", err);
      // If this logs, the browser blocked playback (usually because no user gesture, or file didn't load)
    }
  });

  // When audio ends, reset button
  audio.addEventListener("ended", () => {
    isPlaying = false;
    playBtn.textContent = "▶";
  });

  // Update progress
  audio.addEventListener("timeupdate", () => {
    progress.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  // Seek
  progress.addEventListener("input", () => {
    audio.currentTime = Number(progress.value);
  });

  // Volume
  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    updateVolumeIcon();
  });

  // Click icon to mute/unmute
  volumeIconBtn.addEventListener("click", () => {
    if (audio.volume > 0) {
      lastVolume = audio.volume;
      audio.volume = 0;
      volume.value = 0;
    } else {
      audio.volume = lastVolume || 1;
      volume.value = audio.volume;
    }
    updateVolumeIcon();
  });

  // Initial state
  audio.volume = Number(volume.value);
  updateVolumeIcon();
  loadDuration();
}
