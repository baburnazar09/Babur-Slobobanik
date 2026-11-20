// === АВТОМАТИЧНЕ МЕНЮ-СЛАЙДЕР НА ГОЛОВНІЙ СТОРІНЦІ ===
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.showcase-tab');
  const slides = document.querySelectorAll('.slide-panel');
  const progressBar = document.getElementById('showcase-progress');
  const wrapper = document.getElementById('showcase-wrapper');
  const statusText = document.getElementById('slider-status');

  if (tabs.length && slides.length) {
    let currentIndex = 0;
    const intervalDuration = 8000;
    let timer = null;
    let progressStart = null;
    let animFrame = null;
    let isPaused = false;

    function showSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      tabs.forEach((t, i) => t.classList.toggle('active', i === currentIndex));
      slides.forEach((s, i) => s.classList.toggle('active', i === currentIndex));
      resetProgress();
    }

    function animateProgress(timestamp) {
      if (isPaused) {
        progressStart = timestamp - (parseFloat(progressBar.style.width || 0) / 100) * intervalDuration;
        animFrame = requestAnimationFrame(animateProgress);
        return;
      }
      if (!progressStart) progressStart = timestamp;
      const elapsed = timestamp - progressStart;
      const percent = Math.min((elapsed / intervalDuration) * 100, 100);
      if (progressBar) progressBar.style.width = percent + '%';

      if (elapsed >= intervalDuration) {
        showSlide(currentIndex + 1);
      } else {
        animFrame = requestAnimationFrame(animateProgress);
      }
    }

    function resetProgress() {
      cancelAnimationFrame(animFrame);
      progressStart = null;
      if (progressBar) progressBar.style.width = '0%';
      animFrame = requestAnimationFrame(animateProgress);
    }


    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => showSlide(index));
    });

    
    if (wrapper) {
  wrapper.addEventListener('mouseenter', () => {
    isPaused = true;
  });
  wrapper.addEventListener('mouseleave', () => {
    isPaused = false;
  });
}

    // Кнопки Назад / Вперед
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

    showSlide(0);
  }
});

// === ФІЛЬТРАЦІЯ ГУРТІВ ===
function filterBands(genre, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.cd-card').forEach(card => {
    const cardGenre = card.getAttribute('data-genre');
    if (genre === 'all' || cardGenre === genre || cardGenre === 'all') {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// === ПЛЕЄР У КАРТКАХ ГУРТІВ ===
const cardAudio = new Audio();
let activePlayBtn = null;

cardAudio.addEventListener('ended', () => {
  if (activePlayBtn) {
    activePlayBtn.textContent = '▶';
    activePlayBtn = null;
  }
});

function toggleTrack(btn) {
  const src = btn.getAttribute('data-src');
  if (!src) return;

  if (activePlayBtn === btn && !cardAudio.paused) {
    cardAudio.pause();
    btn.textContent = '▶';
    return;
  }

  document.querySelectorAll('.play-btn').forEach(b => b.textContent = '▶');

  if (activePlayBtn !== btn) {
    cardAudio.src = src;
    activePlayBtn = btn;
  }

  cardAudio.play();
  btn.textContent = '❚❚';
}

// === ДЕМО-РАДІО У HERO ===
const radioPlaylist = [
  {
    title: "ПРИКЛАД ГУРТУ #01 — DEMO_TRACK_01",
    genre: "Nu-Metal / Alternative • м. Вінниця",
    src: "audio/track1.m4a"
  },
  {
    title: "ПРИКЛАД ГУРТУ #02 — DEMO_TRACK_02",
    genre: "Metalcore • м. Жмеринка",
    src: "audio/track2.m4a"
  },
  {
    title: "ПРИКЛАД ГУРТУ #03 — DEMO_TRACK_03",
    genre: "Grunge • м. Козятин",
    src: "audio/track3.mp3"
  }
];

let currentRadioTrack = 0;
const radioAudio = new Audio(radioPlaylist[0].src);

radioAudio.addEventListener('ended', () => {
  nextRadioTrack();
});

function loadRadioTrack(index, autoPlay = false) {
  currentRadioTrack = (index + radioPlaylist.length) % radioPlaylist.length;
  const track = radioPlaylist[currentRadioTrack];
  
  radioAudio.src = track.src;
  const titleEl = document.getElementById('radio-now');
  const subEl = document.getElementById('radio-sub');
  if (titleEl) titleEl.textContent = track.title;
  if (subEl) subEl.textContent = track.genre;

  if (autoPlay) {
    radioAudio.play();
    updateRadioBtn(true);
  }
}

function toggleRadio() {
  if (radioAudio.paused) {
    radioAudio.play();
    updateRadioBtn(true);
  } else {
    radioAudio.pause();
    updateRadioBtn(false);
  }
}

function nextRadioTrack() {
  const wasPlaying = !radioAudio.paused;
  loadRadioTrack(currentRadioTrack + 1, wasPlaying);
}

function updateRadioBtn(isPlaying) {
  const btn = document.getElementById('radio-btn');
  if (btn) {
    btn.textContent = isPlaying ? '❚❚ ПАУЗА' : '▶ СЛУХАТИ ДЕМО-ЕФІР';
  }
}

// === ПІДТРИМАТИ ГУРТ ===
function supportBand(btn) {
  if (btn.classList.contains('supported')) return;
  btn.classList.add('supported');
  btn.style.borderColor = '#D4FF00';
  btn.style.color = '#D4FF00';
  btn.textContent = '✓ ПІДТРИМАНО';
}

// === ЛІЧИЛЬНИК "ЙДУ" НА КОНЦЕРТ ===
function toggleGoing(btn, baseCount) {
  const active = btn.classList.toggle('going');
  btn.textContent = active ? `✓ ЙДУ (${baseCount + 1})` : `ЙДУ (${baseCount})`;
  btn.style.background = active ? '#D4FF00' : '';
  btn.style.color = active ? '#0D0D0D' : '';
  btn.style.borderColor = active ? '#D4FF00' : '';
}

// === МОДАЛЬНЕ ВІКНО ===
function openModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.add('open');
}
function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.remove('open');
}