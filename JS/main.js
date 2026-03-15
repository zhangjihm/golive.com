// Golfive site interactions

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const header = document.querySelector('header');
const backToTopBtn = document.getElementById('back-to-top');

// Smooth scrolling for in-page anchors
for (const anchor of document.querySelectorAll('a[href^="#"]')) {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// Mobile menu toggle (uses .active to match CSS)
if (mobileMenuButton && mobileMenu) {
  const closeMenu = () => {
    mobileMenu.classList.remove('active');
    mobileMenuButton.setAttribute('aria-expanded', 'false');
  };

  mobileMenuButton.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('active');
    mobileMenuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
      closeMenu();
    }
  });

  // close on nav click (mobile)
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
}

// Sticky header effect + back to top visibility + auto hide/show
let lastScrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      
      if (!header) return;
      
      // Add scrolled class for styling
      if (currentScrollY > 100) {
        header.classList.add('scrolled');
        if (backToTopBtn) backToTopBtn.classList.add('visible');
      } else {
        header.classList.remove('scrolled');
        if (backToTopBtn) backToTopBtn.classList.remove('visible');
      }
      
      // Auto hide/show header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        // Scrolling down - hide header
        header.classList.add('header-hidden');
      } else {
        // Scrolling up - show header
        header.classList.remove('header-hidden');
      }
      
      lastScrollY = currentScrollY;
      ticking = false;
    });
    ticking = true;
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Generic form handler (exclude newsletter, which has dedicated behavior)
document.querySelectorAll('form').forEach((form) => {
  if (form.id === 'newsletter-form') return;
  if (form.hasAttribute('data-netlify')) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach((field) => {
      const ok = String(field.value || '').trim().length > 0;
      field.classList.toggle('error', !ok);
      if (!ok) isValid = false;
    });

    if (!isValid) {
      alert('Please fill in all required fields.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const original = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      alert('Thanks! Your message has been sent.');
      form.reset();
      if (submitBtn) {
        submitBtn.textContent = original;
        submitBtn.disabled = false;
      }
    }, 700);
  });
});

// Newsletter form
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput ? emailInput.value : '';
    if (email && validateEmail(email)) {
      alert('Thank you for subscribing to Golfive!');
      newsletterForm.reset();
    } else {
      alert('Please enter a valid email address.');
    }
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Mark current nav item
(function setActiveNav() {
  const path = window.location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = (link.getAttribute('href') || '').replace(/index\.html$/, '');
    if ((path === '/' && href === '/') || (href !== '/' && path.includes(href))) {
      link.classList.add('active');
    }
  });
})();

// Language routing + switcher (zh default, /en English, /ja Japanese)
(function languageRouting() {
  try {
    const path = window.location.pathname;
    const saved = localStorage.getItem('golfive_lang');
    const browserLang = (navigator.language || '').toLowerCase();
    const preferred = saved || (browserLang.startsWith('zh') ? 'zh' : (browserLang.startsWith('ja') ? 'ja' : 'en'));

    // Support both production root and preview nested base path
    const seg = path.split('/').filter(Boolean);
    let basePrefix = '';
    if (window.location.hostname.includes('raw.githack.com') && seg.length >= 3) {
      basePrefix = '/' + seg.slice(0, 3).join('/'); // /owner/repo/branch
    }

    const restPath = path.slice(basePrefix.length) || '/';
    const isEnPath = /^\/en(\/|$)/.test(restPath);
    const isJaPath = /^\/ja(\/|$)/.test(restPath);
    const currentLang = isEnPath ? 'en' : (isJaPath ? 'ja' : 'zh');

    const toLang = (p, lang) => {
      const local = (p.slice(basePrefix.length) || '/').replace(/^\/(en|ja)(?=\/|$)/, '');
      const normalized = local.startsWith('/') ? local : '/' + local;
      if (lang === 'zh') return basePrefix + normalized;
      return basePrefix + `/${lang}` + (normalized === '/' ? '/' : normalized);
    };

    if (!saved && preferred !== currentLang) {
      window.location.href = toLang(path, preferred);
      return;
    }

    const nav = document.querySelector('.nav-container');
    if (!nav) return;
    const op = (l) => (currentLang === l ? '1' : '0.72');
    const holder = document.createElement('div');
    holder.style.marginLeft = '12px';
    holder.style.display = 'inline-flex';
    holder.style.alignItems = 'center';
    holder.style.gap = '8px';
    holder.innerHTML = `<a href="#" id="lang-zh" style="color:#fff;opacity:${op('zh')};font-weight:600;">中</a><span style="color:rgba(255,255,255,.6)">/</span><a href="#" id="lang-en" style="color:#fff;opacity:${op('en')};font-weight:600;">EN</a><span style="color:rgba(255,255,255,.6)">/</span><a href="#" id="lang-ja" style="color:#fff;opacity:${op('ja')};font-weight:600;">日</a>`;
    nav.appendChild(holder);

    const switchLang = (lang) => (e) => {
      e.preventDefault();
      localStorage.setItem('golfive_lang', lang);
      window.location.href = toLang(path, lang);
    };

    holder.querySelector('#lang-zh').addEventListener('click', switchLang('zh'));
    holder.querySelector('#lang-en').addEventListener('click', switchLang('en'));
    holder.querySelector('#lang-ja').addEventListener('click', switchLang('ja'));
  } catch (e) {
    console.warn('language routing skipped', e);
  }
})();

// Image loading animation
document.querySelectorAll('img').forEach(img => {
  if (img.complete) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('loaded'));
  }
});
