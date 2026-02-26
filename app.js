/* ============================================================
   NONLIMI INDUSTRIES — APP.JS · Clean Frost Theme
   Animations, Interactions, Canvas Grid — 2026
   ============================================================ */

'use strict';

/* ---- Sticky Nav ---- */
(function () {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const inner = nav.querySelector('.nav-inner');
  const onScroll = () => {
    if (inner) inner.classList.toggle('scrolled', window.scrollY > 20);
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---- Mobile Menu ---- */
(function () {
  const btn  = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ---- Scroll Reveal ---- */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 0px 0px' });

  // Immediately reveal elements already in viewport on load
  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      io.observe(el);
    }
  });
})();

/* ---- Canvas Dot Grid (Hero) ---- */
(function () {
  const canvas = document.getElementById('gridCanvas');
  if (!canvas) return;

  const ctx  = canvas.getContext('2d');
  let W, H, dots = [], animId;

  const SPACING  = 36;
  const DOT_R    = 1.5;
  const DOT_BASE = 'rgba(15, 23, 41, 0.08)';
  const RADIUS   = 120;
  let mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    const cols = Math.ceil(W / SPACING) + 1;
    const rows = Math.ceil(H / SPACING) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({ x: c * SPACING, y: r * SPACING, lit: 0 });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      const dx   = d.x - mouse.x;
      const dy   = d.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const t    = Math.max(0, 1 - dist / RADIUS);
      d.lit      += (t - d.lit) * 0.12;

      ctx.beginPath();
      ctx.arc(d.x, d.y, DOT_R, 0, Math.PI * 2);
      if (d.lit < 0.01) {
        ctx.fillStyle = DOT_BASE;
      } else {
        ctx.fillStyle = `rgba(0, 82, 255, ${0.08 + d.lit * 0.27})`;
      }
      ctx.fill();
    });
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse = { x: -999, y: -999 };
  });

  resize();
  draw();
})();

/* ---- CTA Canvas (particles) ---- */
(function () {
  const canvas = document.getElementById('ctaCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((W * H) / 8000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ---- Early Access Form ---- */
(function () {
  const btn = document.getElementById('accessBtn');
  const input = document.getElementById('accessEmail');
  const note = document.getElementById('formNote');
  if (!btn || !input) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
      if (note) note.textContent = '// PLEASE ENTER A VALID EMAIL';
      return;
    }
    btn.textContent = 'SUBMITTING...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'ACCESS REQUESTED ✓';
      btn.style.background = '#16a34a';
      if (note) note.textContent = '// WE\'LL BE IN TOUCH SHORTLY';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'REQUEST EARLY ACCESS';
        btn.style.background = '';
        btn.disabled = false;
        if (note) note.textContent = '// CURRENTLY ACCEPTING EARLY ACCESS PARTNERS';
      }, 4000);
    }, 1200);
  });
})();

/* ---- Smooth anchor scroll ---- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ---- Console Easter Egg ---- */
console.log('%c// nonlimi.com | sp@nonlimi.com', 'color: #98A1B3; font-family: monospace; font-size: 11px;');
