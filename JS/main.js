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

// Sticky header effect
window.addEventListener('scroll', () => {
  if (!header) return;
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
    if (backToTopBtn) backToTopBtn.classList.remove('hidden');
  } else {
    header.classList.remove('scrolled');
    if (backToTopBtn) backToTopBtn.classList.add('hidden');
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
    if ((path === '/' && href === '/') || (href !== '/' && path.startsWith(href))) {
      link.classList.add('active');
    }
  });
})();
