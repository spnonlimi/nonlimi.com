/* ============================================================
   NONLIMI INDUSTRIES — APP.JS v2
   Animations, Interactions, Canvas Grid
   ============================================================ */

'use strict';

// ---- NAV scroll behavior ----
(function () {
  const nav     = document.getElementById('main-nav');
  const toggle  = document.getElementById('mobileToggle');
  const menu    = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Intersection Observer — scroll reveals ----
(function () {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

  // Stagger children inside grids
  const staggerParents = document.querySelectorAll(
    '.cap-grid, .usecase-grid, .team-grid, .stack-layers'
  );

  staggerParents.forEach(parent => {
    const children = parent.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = (i * 80) + 'ms';
    });
  });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

// ---- Canvas — Hero animated grid ----
(function () {
  const canvas = document.getElementById('gridCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function draw(time) {
    ctx.clearRect(0, 0, W, H);

    const gs     = 60;
    const speed  = 0.014;
    const offset = (time * speed) % gs;

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    for (let x = offset % gs; x < W; x += gs) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = offset % gs; y < H; y += gs) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();

    // Intersection nodes
    ctx.fillStyle = 'rgba(0, 229, 255, 0.1)';
    for (let x = offset % gs; x < W; x += gs) {
      for (let y = offset % gs; y < H; y += gs) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Diagonal accents
    ctx.strokeStyle = 'rgba(0, 102, 255, 0.02)';
    ctx.lineWidth   = 0.5;
    ctx.beginPath();
    for (let i = -H; i < W + H; i += 200) {
      ctx.moveTo(i, 0); ctx.lineTo(i + H, H);
    }
    ctx.stroke();

    // Radial glow from lower-left
    const g = ctx.createRadialGradient(W * 0.15, H * 0.75, 0, W * 0.15, H * 0.75, Math.max(W, H) * 0.75);
    g.addColorStop(0, 'rgba(0, 229, 255, 0.055)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  requestAnimationFrame(draw);
})();

// ---- Canvas — CTA section grid ----
(function () {
  const canvas = document.getElementById('ctaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function draw(time) {
    ctx.clearRect(0, 0, W, H);
    const gs     = 48;
    const offset = (time * 0.008) % gs;

    ctx.strokeStyle = 'rgba(0, 229, 255, 0.035)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    for (let x = offset % gs; x < W; x += gs) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = offset % gs; y < H; y += gs) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();

    ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
    for (let x = offset % gs; x < W; x += gs) {
      for (let y = offset % gs; y < H; y += gs) {
        ctx.beginPath();
        ctx.arc(x, y, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  requestAnimationFrame(draw);
})();

// ---- Hover glow effect — platform layers ----
(function () {
  document.querySelectorAll('.stack-layer').forEach(layer => {
    layer.addEventListener('mouseenter', () => {
      layer.style.transform = 'translateX(6px)';
    });
    layer.addEventListener('mouseleave', () => {
      layer.style.transform = '';
    });
  });
})();

// ---- Capability card scan-line on hover ----
(function () {
  document.querySelectorAll('.cap-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('hover-active'));
    card.addEventListener('mouseleave', () => card.classList.remove('hover-active'));
  });
})();

// ---- Early Access Form ----
(function () {
  const btn   = document.getElementById('accessBtn');
  const input = document.getElementById('accessEmail');
  const note  = document.getElementById('formNote');

  if (!btn || !input || !note) return;

  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  btn.addEventListener('click', () => {
    const val = input.value.trim();
    if (!val) {
      note.style.color = '#FF3D00';
      note.textContent  = '// ENTER YOUR EMAIL TO REQUEST ACCESS';
      input.focus();
      return;
    }
    if (!isValidEmail(val)) {
      note.style.color = '#FF3D00';
      note.textContent  = '// INVALID EMAIL FORMAT';
      input.focus();
      return;
    }

    btn.disabled      = true;
    btn.textContent   = 'SENDING...';
    note.style.color  = '';
    note.textContent  = '// PROCESSING REQUEST...';

    setTimeout(() => {
      note.style.color = '#00E5FF';
      note.textContent  = '// REQUEST RECEIVED — WE\'LL BE IN TOUCH';
      btn.textContent   = 'REQUEST SENT ✓';
      input.value       = '';
      input.disabled    = true;
    }, 1000);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') btn.click();
  });
})();

// ---- Comparison table row highlight ----
(function () {
  document.querySelectorAll('.comp-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.style.background = 'rgba(0, 229, 255, 0.025)';
    });
    row.addEventListener('mouseleave', () => {
      row.style.background = '';
    });
  });
})();

// ---- Team avatar pulse on hover ----
(function () {
  document.querySelectorAll('.team-card').forEach(card => {
    const glow = card.querySelector('.avatar-glow');
    if (!glow) return;
    card.addEventListener('mouseenter', () => glow.style.opacity = '1');
    card.addEventListener('mouseleave', () => glow.style.opacity = '');
  });
})();

// ---- Console signature ----
console.log('%c NONLIMI INDUSTRIES ', 'background: #00E5FF; color: #000; font-family: monospace; font-weight: bold; padding: 4px 12px; font-size: 14px;');
console.log('%c// Simulation Infrastructure for Physical AI', 'color: #00E5FF; font-family: monospace; font-size: 12px;');
console.log('%c// nonlimi.com | sp@nonlimi.com', 'color: #3A4255; font-family: monospace; font-size: 11px;');
