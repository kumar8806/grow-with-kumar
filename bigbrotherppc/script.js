/* ==========================================================================
   BIG BROTHER PPC — script.js
   No analytics, tracking, or third-party pixel code is included here.
   Integration placeholders are marked clearly for future use.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------------------
     1. STICKY HEADER SHADOW ON SCROLL
     ------------------------------------------------------------------ */
  var header = document.getElementById('siteHeader');
  function handleHeaderScroll() {
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  /* ------------------------------------------------------------------
     2. MOBILE NAV TOGGLE
     ------------------------------------------------------------------ */
  var navToggle = document.getElementById('navToggle');
  var navMobile = document.getElementById('navMobile');

  function closeMobileNav() {
    navToggle.classList.remove('is-active');
    navMobile.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    var isOpen = navMobile.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMobile.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  /* ------------------------------------------------------------------
     3. SMOOTH SCROLLING FOR ANCHOR LINKS (with header offset)
     ------------------------------------------------------------------ */
  var headerHeight = header.offsetHeight;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;
      window.scrollTo({ top: top, behavior: 'smooth' });
      closeMobileNav();
    });
  });

  /* ------------------------------------------------------------------
     4. FAQ ACCORDION
     ------------------------------------------------------------------ */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      // Close all other items (single-open accordion)
      faqItems.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ------------------------------------------------------------------
     5. BACK TO TOP BUTTON
     ------------------------------------------------------------------ */
  var backToTop = document.getElementById('backToTop');
  function handleBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  }
  handleBackToTop();
  window.addEventListener('scroll', handleBackToTop, { passive: true });
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS
     ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ------------------------------------------------------------------
     7. ANIMATED STAT COUNTERS (Benefits panel)
     ------------------------------------------------------------------ */
  var statEls = document.querySelectorAll('.stat-num');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var isDecimal = target % 1 !== 0;
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      var current = target * eased;
      el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && statEls.length) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(function (el) { statObserver.observe(el); });
  } else {
    statEls.forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ------------------------------------------------------------------
     8. HERO "LIVE" READOUT — decorative metric micro-updates
     Purely cosmetic UI animation, not real analytics data.
     ------------------------------------------------------------------ */
  var leadsEl = document.getElementById('statLeads');
  if (leadsEl) {
    var leadCount = 27;
    setInterval(function () {
      leadCount += Math.random() > 0.5 ? 1 : 0;
      leadsEl.innerHTML = leadCount + '<span class="trend trend--up">▲ live</span>';
    }, 4500);
  }

  /* ------------------------------------------------------------------
     9. LEAD FORM VALIDATION + SUBMISSION
     ------------------------------------------------------------------ */
  var form = document.getElementById('leadForm');
  var submitBtn = document.getElementById('submitBtn');
  var formStatus = document.getElementById('formStatus');

  var validators = {
    fullName: function (v) { return v.trim().length >= 2; },
    mobile: function (v) { return /^[6-9]\d{9}$/.test(v.trim()); },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
    businessName: function (v) { return v.trim().length >= 2; },
    service: function (v) { return v.trim().length > 0; },
    message: function (v) { return v.trim().length <= 600; }
  };

  function setFieldError(fieldName, hasError) {
    var wrapper = form.querySelector('[data-field="' + fieldName + '"]');
    if (!wrapper) return;
    wrapper.classList.toggle('has-error', hasError);
  }

  function validateField(input) {
    var name = input.name;
    if (!validators[name]) return true;
    var valid = validators[name](input.value);
    setFieldError(name, !valid);
    return valid;
  }

  // Live validation as the user types / leaves a field
  ['fullName', 'mobile', 'email', 'businessName', 'service', 'message'].forEach(function (name) {
    var input = form.elements[name];
    if (!input) return;
    input.addEventListener('blur', function () { validateField(input); });
    input.addEventListener('input', function () {
      if (form.querySelector('[data-field="' + name + '"]').classList.contains('has-error')) {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var fields = ['fullName', 'mobile', 'email', 'businessName', 'service', 'message'];
    var allValid = true;

    fields.forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;
      var valid = validateField(input);
      if (!valid) allValid = false;
    });

    formStatus.classList.remove('is-visible', 'is-error');
    formStatus.textContent = '';

    if (!allValid) {
      formStatus.textContent = 'Please fix the highlighted fields and try again.';
      formStatus.classList.add('is-visible', 'is-error');
      var firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // Button loading state
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    /* ------------------------------------------------------------
       FORM SUBMISSION PLACEHOLDER
       Replace this simulated delay with a real fetch() call to your
       backend / CRM endpoint, e.g.:

       fetch('https://your-api.example.com/leads', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(Object.fromEntries(new FormData(form)))
       }).then(...).catch(...);

       No GTM / GA4 / Google Ads conversion / Meta Pixel code should
       be added here per project requirements.
       ------------------------------------------------------------ */
    setTimeout(function () {
      window.location.href = 'thank-you.html';
    }, 1200);
  });

  /* ------------------------------------------------------------------
     10. FOOTER YEAR
     ------------------------------------------------------------------ */
  var footerYear = document.getElementById('footerYear');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

});
