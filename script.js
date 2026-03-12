/* =========================================
   SCOTT CARGOE — PORTFOLIO SCRIPTS
   ========================================= */

/* ===== STARFIELD ===== */
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 6000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.2,
        alpha: Math.random() * 0.6 + 0.1,
        speed: Math.random() * 0.3 + 0.05,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawStars(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#050a14');
    grad.addColorStop(0.5, '#07101f');
    grad.addColorStop(1, '#060b18');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
      const twinkle = Math.sin(t * s.twinkleSpeed + s.twinkleOffset) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 230, 255, ${s.alpha * twinkle})`;
      ctx.fill();
    });
  }

  let last = 0;
  function loop(t) {
    if (t - last > 40) { // ~24fps for perf
      drawStars(t);
      last = t;
    }
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  animId = requestAnimationFrame(loop);
})();


/* ===== SCROLL PROGRESS BAR ===== */
const progressBar = document.getElementById('progress-bar');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });


/* ===== NAVBAR SCROLL STATE ===== */
const navbar = document.getElementById('navbar');
function updateNav() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();


/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el, i) => {
  // Stagger items inside grids
  if (el.parentElement.classList.contains('projects-grid') ||
      el.parentElement.classList.contains('skills-grid')) {
    el.style.transitionDelay = (i % 3) * 0.1 + 's';
  }
  revealObserver.observe(el);
});


/* ===== TYPED TITLE EFFECT ===== */
(function initTyped() {
  const el = document.getElementById('typed-title');
  if (!el) return;

  const titles = [
    'Aerospace Engineer',
    'Systems Designer',
    'CFD Specialist',
    'GNC Developer',
    'Problem Solver',
  ];

  let titleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let paused = false;
  const SPEED_TYPE = 80;
  const SPEED_DELETE = 40;
  const PAUSE_END = 2000;
  const PAUSE_START = 400;

  function tick() {
    const current = titles[titleIdx];

    if (!deleting && charIdx <= current.length) {
      el.textContent = current.slice(0, charIdx);
      charIdx++;
      if (charIdx > current.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; tick(); }, PAUSE_END);
        return;
      }
      setTimeout(tick, SPEED_TYPE);
    } else if (deleting && charIdx >= 0) {
      el.textContent = current.slice(0, charIdx);
      charIdx--;
      if (charIdx < 0) {
        deleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
        charIdx = 0;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, SPEED_DELETE);
    }
  }

  setTimeout(tick, 800);
})();


/* ===== CONTACT FORM ===== */
(function initForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    // Simulate async send (replace with real API call)
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      form.reset();
      status.textContent = 'Message sent! I\'ll get back to you soon.';
      status.style.color = '#00d4ff';
      setTimeout(() => { status.textContent = ''; }, 5000);
    }, 1200);
  });
})();


/* ===== ACTIVE NAV LINK HIGHLIGHT ===== */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active-nav', link.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
})();
