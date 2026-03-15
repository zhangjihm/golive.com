// Golfive site interactions - Enhanced with reliable header auto-hide
(function() {
  'use strict';

  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const header = document.querySelector('.header') || document.querySelector('header');
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

  // Mobile menu toggle
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

    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  }

  // Header auto hide/show on scroll
  if (header) {
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      
      // Back to top button
      if (backToTopBtn) {
        backToTopBtn.style.opacity = currentScrollY > 400 ? '1' : '0';
        backToTopBtn.style.visibility = currentScrollY > 400 ? 'visible' : 'hidden';
      }
      
      // Header hide/show logic
      if (currentScrollY < 80) {
        // Always show near top
        header.classList.remove('header-hidden');
      } else if (scrollDelta > 8) {
        // Scrolling down - hide
        header.classList.add('header-hidden');
      } else if (scrollDelta < -5) {
        // Scrolling up - show
        header.classList.remove('header-hidden');
      }
      
      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  // Back to top button click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Form handlers
  document.querySelectorAll('form').forEach((form) => {
    if (form.id === 'newsletter-form' || form.hasAttribute('data-netlify')) return;

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
        alert('请填写所有必填字段');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = '发送中...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        alert('消息已发送！我们会尽快回复。');
        form.reset();
        if (submitBtn) {
          submitBtn.textContent = '发送消息';
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
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('感谢订阅 Golfive！');
        newsletterForm.reset();
      } else {
        alert('请输入有效的邮箱地址');
      }
    });
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

  // Language routing
  (function languageRouting() {
    try {
      const path = window.location.pathname;
      const saved = localStorage.getItem('golfive_lang');
      const browserLang = (navigator.language || '').toLowerCase();
      const preferred = saved || (browserLang.startsWith('zh') ? 'zh' : (browserLang.startsWith('ja') ? 'ja' : 'en'));

      const seg = path.split('/').filter(Boolean);
      let basePrefix = '';
      if (window.location.hostname.includes('raw.githack.com') && seg.length >= 3) {
        basePrefix = '/' + seg.slice(0, 3).join('/');
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
      holder.style.cssText = 'margin-left:12px;display:inline-flex;align-items:center;gap:8px;';
      holder.innerHTML = `<a href="#" id="lang-zh" style="color:#fff;opacity:${op('zh')};font-weight:600;text-decoration:none;">中</a><span style="color:rgba(255,255,255,.6)">/</span><a href="#" id="lang-en" style="color:#fff;opacity:${op('en')};font-weight:600;text-decoration:none;">EN</a><span style="color:rgba(255,255,255,.6)">/</span><a href="#" id="lang-ja" style="color:#fff;opacity:${op('ja')};font-weight:600;text-decoration:none;">日</a>`;
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
})();