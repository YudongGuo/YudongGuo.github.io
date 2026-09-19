// Keep previews still until visible; the poster and full-size link work without JS.
(() => {
  const videos = [...document.querySelectorAll('.paper-img video')];
  const toggle = document.querySelector('.preview-toggle');
  if (!videos.length || !toggle) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  const visible = new Set();

  function updateVideo(video) {
    if (paused || document.hidden || !visible.has(video)) {
      video.pause();
    } else {
      video.muted = true;
      const playing = video.play();
      if (playing) playing.catch(() => {}); // Poster remains if autoplay is blocked.
    }
  }

  function updateAll() {
    toggle.textContent = paused ? 'Resume previews' : 'Pause previews';
    toggle.setAttribute('aria-pressed', String(paused));
    videos.forEach(updateVideo);
  }

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    paused = !paused;
    updateAll();
  });
  reducedMotion.addEventListener('change', event => {
    paused = event.matches;
    updateAll();
  });
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
  } else {
    // Older browsers still get posters and working full-size video links.
    toggle.hidden = true;
  }
  updateAll();
})();
