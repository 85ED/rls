/* =========================================================
   RLS Engenharia e Consultoria – main.js
   ========================================================= */

(function () {
  'use strict';

  // ----- Header scroll shadow -----
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ----- Mobile nav toggle -----
  const navToggle = document.getElementById('navToggle');
  const mainNav   = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    // Close nav on link click (mobile)
    mainNav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu');
      });
    });

    // Close nav on outside click
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open') &&
          !mainNav.contains(e.target) &&
          !navToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu');
      }
    });
  }

  const SECTION_OFFSET    = 100; // px above fold to consider section active
  const STAGGER_GROUP_SIZE = 4;  // number of elements per stagger group
  const SUCCESS_MSG_MS    = 6000; // ms to show success message
  const sections = document.querySelectorAll('main section[id]');
  const navLinks  = document.querySelectorAll('.nav__link[href^="#"]');

  if (sections.length && navLinks.length) {
    const activateLink = () => {
      let current = '';
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - SECTION_OFFSET) {
          current = section.id;
        }
      });
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    };
    window.addEventListener('scroll', activateLink, { passive: true });
    activateLink();
  }

  // ----- Animated counters -----
  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const step     = 16;
    const steps    = duration / step;
    const increment = target / steps;
    let current = 0;

    const tick = () => {
      current += increment;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(tick);
  };

  const counterEls = document.querySelectorAll('.stat-card__number[data-target]');
  if (counterEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counterEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: set final values immediately
    counterEls.forEach(el => { el.textContent = el.dataset.target; });
  }

  // ----- Reveal sections on scroll -----
  const revealEls = document.querySelectorAll(
    '.service-card, .energy__step, .energy__highlight-card, .ev__feature, .stat-card'
  );

  if (revealEls.length && 'IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = `
      .reveal { opacity: 0; transform: translateY(24px); transition: opacity .5s ease, transform .5s ease; }
      .reveal.visible { opacity: 1; transform: none; }
    `;
    document.head.appendChild(style);

    revealEls.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = ((i % STAGGER_GROUP_SIZE) * 80) + 'ms';
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ----- Contact form validation -----
  const form = document.getElementById('contactForm');
  if (form) {
    const successMsg = document.getElementById('formSuccess');

    const validators = {
      name:    (v) => v.trim().length >= 2  ? '' : 'Informe seu nome completo.',
      email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Informe um e-mail válido.',
      subject: (v) => v !== ''              ? '' : 'Selecione um assunto.',
      message: (v) => v.trim().length >= 10 ? '' : 'A mensagem deve ter ao menos 10 caracteres.',
    };

    const showError = (fieldId, msg) => {
      const field = document.getElementById(fieldId);
      const error = document.getElementById(fieldId + 'Error');
      if (!field || !error) return;
      if (msg) {
        field.classList.add('invalid');
        error.textContent = msg;
      } else {
        field.classList.remove('invalid');
        error.textContent = '';
      }
    };

    // Inline validation on blur
    Object.keys(validators).forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (!field) return;
      field.addEventListener('blur', () => {
        showError(fieldId, validators[fieldId](field.value));
      });
      field.addEventListener('input', () => {
        if (field.classList.contains('invalid')) {
          showError(fieldId, validators[fieldId](field.value));
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      Object.keys(validators).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;
        const msg = validators[fieldId](field.value);
        showError(fieldId, msg);
        if (msg) valid = false;
      });

      if (!valid) return;

      // Simulate form submission (replace with actual backend / service)
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensagem';
        if (successMsg) {
          successMsg.textContent = '✓ Mensagem enviada com sucesso! Retornaremos em breve.';
          setTimeout(() => { successMsg.textContent = ''; }, SUCCESS_MSG_MS);
        }
      }, 1200);
    });
  }

  // ----- Footer year -----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
