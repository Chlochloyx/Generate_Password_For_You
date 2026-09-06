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

// Active nav link on scroll, with a pill that slides to match
const sections = document.querySelectorAll('main section[id]');
const navLinksList = document.getElementById('navLinks');
const navLinks = document.querySelectorAll('.nav-links a');
const navPill = document.getElementById('navPill');

const moveNavPill = () => {
  const active = document.querySelector('.nav-links a.active');
  if (!active || !navPill || !navLinksList) { if (navPill) navPill.style.opacity = '0'; return; }
  const listBox = navLinksList.getBoundingClientRect();
  const linkBox = active.getBoundingClientRect();
  navPill.style.opacity = '1';
  navPill.style.width = `${linkBox.width}px`;
  navPill.style.transform = `translateX(${linkBox.left - listBox.left}px)`;
};

const setActiveLink = () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 140;
    if (window.scrollY >= top) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
  moveNavPill();
};
setActiveLink();
window.addEventListener('scroll', setActiveLink, { passive: true });
window.addEventListener('resize', moveNavPill);

// Scroll progress bar
const scrollProgress = document.getElementById('scrollProgress');
const updateScrollProgress = () => {
  if (!scrollProgress) return;
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  scrollProgress.style.width = `${pct}%`;
};
updateScrollProgress();
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);

// Back to top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

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
// Tilt-on-hover for cards (subtle 3D perspective)
// ============================================
if (!prefersReducedMotion && hasHover) {
  document.querySelectorAll('.tilt-target').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const box = card.getBoundingClientRect();
      const px = (e.clientX - box.left) / box.width - 0.5;
      const py = (e.clientY - box.top) / box.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============================================
// Magnetic buttons — gently pull toward the cursor
// ============================================
if (!prefersReducedMotion && hasHover) {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const box = btn.getBoundingClientRect();
      const mx = (e.clientX - box.left - box.width / 2) * 0.25;
      const my = (e.clientY - box.top - box.height / 2) * 0.35;
      btn.style.transform = `translate(${mx.toFixed(1)}px, ${my.toFixed(1)}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ============================================
// Parallax drift on the aurora / glow blobs while scrolling
// ============================================
if (!prefersReducedMotion) {
  // .aurora already animates its own transform via CSS (auroraDrift keyframes),
  // so only the glow-blobs (which have no competing animation) get scroll parallax here.
  const parallaxEls = Array.from(document.querySelectorAll('.glow-blob')).map(el => ({ el, factor: 0.04 }));

  let lastY = window.scrollY;
  const applyParallax = () => {
    lastY = window.scrollY;
    parallaxEls.forEach(({ el, factor }) => {
      el.style.transform = `translate3d(0, ${(lastY * factor).toFixed(1)}px, 0)`;
    });
  };
  applyParallax();
  window.addEventListener('scroll', () => requestAnimationFrame(applyParallax), { passive: true });
}

// ============================================
// Starfield backdrop — fixed full-viewport, twinkling + shooting stars
// ============================================
const starCanvas = document.getElementById('stars');
if (starCanvas) {
  const ctx = starCanvas.getContext('2d');
  let stars = [];
  let meteors = [];
  let width, height, dpr;
  let nextMeteorAt = 2000 + Math.random() * 3000;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    starCanvas.width = width * dpr;
    starCanvas.height = height * dpr;
    starCanvas.style.width = width + 'px';
    starCanvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(220, Math.floor((width * height) / 6000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.4 + Math.random() * 1.3,
      baseAlpha: 0.25 + Math.random() * 0.6,
      speed: 0.4 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.04,
    }));
  }

  function spawnMeteor() {
    const startX = Math.random() * width * 0.7 + width * 0.15;
    const startY = Math.random() * height * 0.35;
    const angle = (35 + Math.random() * 20) * (Math.PI / 180); // downward-right
    const speed = 9 + Math.random() * 6;
    meteors.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 70 + Math.random() * 60,
      life: 0,
      maxLife: 40 + Math.random() * 20,
    });
  }

  function draw(time, dt) {
    ctx.clearRect(0, 0, width, height);

    // Twinkling / drifting stars
    for (const s of stars) {
      const twinkle = Math.sin(time * 0.001 * s.speed + s.phase) * 0.5 + 0.5;
      ctx.globalAlpha = s.baseAlpha * (0.4 + twinkle * 0.6);
      ctx.fillStyle = '#eaf2ff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (!prefersReducedMotion) s.y -= s.drift;
      if (s.y < -2) s.y = height + 2;
      if (s.y > height + 2) s.y = -2;
    }
    ctx.globalAlpha = 1;

    // Occasional shooting stars
    if (!prefersReducedMotion) {
      nextMeteorAt -= dt;
      if (nextMeteorAt <= 0) {
        spawnMeteor();
        nextMeteorAt = 3500 + Math.random() * 5500;
      }
      meteors = meteors.filter(m => m.life < m.maxLife);
      for (const m of meteors) {
        m.life++;
        m.x += m.vx;
        m.y += m.vy;
        const fade = 1 - m.life / m.maxLife;
        const tailX = m.x - m.vx * (m.len / (Math.hypot(m.vx, m.vy) || 1));
        const tailY = m.y - m.vy * (m.len / (Math.hypot(m.vx, m.vy) || 1));
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }
    }

    requestAnimationFrame(nextTime => draw(nextTime, nextTime - time));
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(t => draw(t, 16));
}
