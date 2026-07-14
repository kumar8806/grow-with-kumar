(function () {
  "use strict";

  /* ---- Sticky navbar background on scroll ---- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    if (window.scrollY > 30) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu toggle ---- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---- Scroll reveal (GSAP-like) via IntersectionObserver ---- */
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) % 4 : 0;
          el.style.transitionDelay = delay * 80 + "ms";
          el.classList.add("visible");
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  reveals.forEach((el) => io.observe(el));

  /* ---- Animated counters for stats ---- */
  const stats = document.querySelectorAll(".stat-num");
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || "";
        const prefix = el.dataset.prefix || "";
        const isFloat = target % 1 !== 0;
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        statObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  stats.forEach((el) => statObserver.observe(el));

  /* ---- Card cursor glow ---- */
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  /* ---- FAQ: keep single item open (accordion) ---- */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---- Contact form -> mailto ---- */
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const get = (id) => (document.getElementById(id).value || "").trim();
    const name = get("name");
    const business = get("business");
    const email = get("email");
    const phone = get("phone");
    const budget = get("budget");
    const message = get("message");

    const subject = encodeURIComponent("New Strategy Call Request - " + (name || "Website Lead"));
    const body = encodeURIComponent(
      "Name: " + name + "\n" +
      "Business: " + business + "\n" +
      "Email: " + email + "\n" +
      "Phone: " + phone + "\n" +
      "Monthly Budget: " + budget + "\n\n" +
      "Message:\n" + message
    );
    window.location.href = "mailto:kedemkumar04@gmail.com?subject=" + subject + "&body=" + body;
  });

  /* ---- Footer year ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();