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

  // Header auto hide/show on scroll - Enhanced version
  if (header) {
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    let scrollVelocity = 0;
    let ticking = false;
    
    // Configuration
    const CONFIG = {
      thresholdDown: 2,      // 下滚多少像素触发隐藏（越小越灵敏）
      thresholdUp: 1,        // 上滚多少像素触发显示（越小越灵敏）
      minScrollToHide: 50,   // 至少滚动多少距离才开始考虑隐藏
      velocityFactor: 0.3    // 速度因子，用于平滑处理
    };
    
    function updateHeader() {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastScrollTime;
      const scrollDelta = currentScrollY - lastScrollY;
      
      // Calculate scroll velocity (pixels per millisecond)
      if (timeDelta > 0) {
        const currentVelocity = scrollDelta / timeDelta;
        scrollVelocity = scrollVelocity * (1 - CONFIG.velocityFactor) + currentVelocity * CONFIG.velocityFactor;
      }
      
      // Back to top button - smooth opacity transition
      if (backToTopBtn) {
        const showBackToTop = currentScrollY > 300;
        backToTopBtn.style.opacity = showBackToTop ? '1' : '0';
        backToTopBtn.style.visibility = showBackToTop ? 'visible' : 'hidden';
      }
      
      // Header hide/show logic with velocity awareness
      const shouldShow = currentScrollY < CONFIG.minScrollToHide || 
                         scrollDelta < -CONFIG.thresholdUp || 
                         (scrollDelta < 0 && scrollVelocity < -0.1);
                         
      const shouldHide = currentScrollY >= CONFIG.minScrollToHide && 
                         scrollDelta > CONFIG.thresholdDown && 
                         scrollVelocity > 0.05;
      
      if (shouldShow) {
        header.classList.remove('header-hidden');
      } else if (shouldHide) {
        header.classList.add('header-hidden');
      }
      
      lastScrollY = currentScrollY;
      lastScrollTime = currentTime;
      ticking = false;
    }

    // Use both scroll and touchmove for mobile responsiveness
    const updateOnScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateOnScroll, { passive: true });
    
    // Also handle touch events for mobile Safari
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      const touchY = e.touches[0].clientY;
      const touchDelta = touchStartY - touchY;
      
      if (Math.abs(touchDelta) > 5) {
        updateOnScroll();
      }
    }, { passive: true });
    
    // Initial check
    updateHeader();
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