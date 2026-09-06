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

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasHover = matchMedia('(hover: hover)').matches;

// ============================================
// Soft cursor glow that follows the pointer
// ============================================
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && !prefersReducedMotion && hasHover) {
  let glowX = 0, glowY = 0, targetX = 0, targetY = 0;
  window.addEventListener('pointermove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    cursorGlow.style.opacity = '1';
  }, { passive: true });
  document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });

  function animateGlow() {
    glowX += (targetX - glowX) * 0.12;
    glowY += (targetY - glowY) * 0.12;
    cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  }
  requestAnimationFrame(animateGlow);
}

// ============================================
// Particle network background (hero canvas)
// ============================================
const canvas = document.getElementById('particles');
if (canvas && !prefersReducedMotion) {
  const ctx = canvas.getContext('2d');
  const hero = canvas.closest('.hero');
  let particles = [];
  let width, height;
  const COLORS = ['rgba(41,230,255,', 'rgba(139,107,255,', 'rgba(255,95,196,'];

  function resize() {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
    const count = Math.min(70, Math.floor((width * height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * 1.6,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(120,150,220,${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const p of particles) {
      ctx.beginPath();
      ctx.fillStyle = p.c + '0.8)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(step);
}
