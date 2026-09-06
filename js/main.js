// ============================================
// Tan Ying Xiu — Portfolio interactions
// ============================================

document.getElementById('year').textContent = new Date().getFullYear();

// Sticky header shadow on scroll
const header = document.getElementById('siteHeader');
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 12);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mobilePanel = document.getElementById('mobilePanel');
navToggle.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
mobilePanel.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const setActiveLink = () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 140;
    if (window.scrollY >= top) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};
setActiveLink();
window.addEventListener('scroll', setActiveLink, { passive: true });

// Scroll-reveal animation
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ============================================
// 🌈 Rainbow cursor trail
// ============================================
const RAINBOW = ['#ff3caf', '#ff9c3c', '#ffd93c', '#3cff9d', '#3cd6ff', '#a53cff'];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastTrailAt = 0;

if (!prefersReducedMotion && matchMedia('(hover: hover)').matches) {
  window.addEventListener('pointermove', (e) => {
    const now = Date.now();
    if (now - lastTrailAt < 35) return; // throttle
    lastTrailAt = now;
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    dot.style.background = RAINBOW[Math.floor(Math.random() * RAINBOW.length)];
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 650);
  }, { passive: true });
}

// ============================================
// 🎉 Click confetti burst
// ============================================
function burstConfetti(x, y) {
  const count = prefersReducedMotion ? 0 : 14;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 70;
    piece.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    piece.style.setProperty('--dy', `${Math.sin(angle) * dist - 20}px`);
    piece.style.setProperty('--rot', `${Math.random() * 360}deg`);
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.background = RAINBOW[Math.floor(Math.random() * RAINBOW.length)];
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 950);
  }
}
document.addEventListener('click', (e) => {
  burstConfetti(e.clientX, e.clientY);
  playBlip();
});

// ============================================
// 🎵 Retro chiptune toggle (Web Audio, no files)
// ============================================
let audioCtx = null;
let soundOn = false;
let melodyTimer = null;

function ensureAudioCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'square', gainValue = 0.05, delay = 0) {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = gainValue;
  osc.connect(gain).connect(ctx.destination);
  const startAt = ctx.currentTime + delay;
  gain.gain.setValueAtTime(gainValue, startAt);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
}

function playBlip() {
  if (!soundOn) return;
  playTone(520 + Math.random() * 300, 0.09, 'square', 0.04);
}

// A tiny looping 8-bit arpeggio, purely generated — no audio files needed
const MELODY = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25]; // C E G C G E
let melodyStep = 0;
function scheduleMelody() {
  if (!soundOn) return;
  playTone(MELODY[melodyStep % MELODY.length], 0.28, 'triangle', 0.03);
  melodyStep++;
  melodyTimer = setTimeout(scheduleMelody, 320);
}

const soundToggle = document.getElementById('soundToggle');
soundToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  soundOn = !soundOn;
  soundToggle.setAttribute('aria-pressed', String(soundOn));
  const ctx = ensureAudioCtx();
  if (ctx && ctx.state === 'suspended') ctx.resume();
  if (soundOn) {
    scheduleMelody();
  } else if (melodyTimer) {
    clearTimeout(melodyTimer);
  }
});
