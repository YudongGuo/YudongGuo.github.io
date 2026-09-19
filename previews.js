// Keep previews still until visible; show the poster when playback is unavailable.
(() => {
  const videos = [...document.querySelectorAll('.paper-img video')];
  if (!videos.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();

  function updateVideo(video) {
    if (reducedMotion.matches || document.hidden || !visible.has(video)) {
      video.pause();
    } else {
      video.muted = true;
      const playing = video.play();
      if (playing) playing.catch(() => {}); // Poster remains if autoplay is blocked.
    }
  }

  function updateAll() {
    videos.forEach(updateVideo);
  }

  reducedMotion.addEventListener('change', updateAll);
  document.addEventListener('visibilitychange', updateAll);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) visible.add(entry.target);
        else visible.delete(entry.target);
        updateVideo(entry.target);
      }
    }, { threshold: [0, 0.15] });
    videos.forEach(video => observer.observe(video));
  }
  updateAll();
})();
