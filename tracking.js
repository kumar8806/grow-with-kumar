/* =========================================================================
   LEAD TRACKING ENGINE
   -------------------------------------------------------------------------
   Captures Google Ads / Meta / Microsoft Ads click IDs and UTM parameters
   on landing, persists them in sessionStorage for the whole visit, injects
   them into every form on the page as hidden fields, and fires the
   standard conversion events once a form submits successfully.

   HOW TO USE
   1. Include this file on every page of the funnel (landing page,
      thank-you page, any intermediate steps):
         <script src="tracking.js"></script>
   2. Add a <form> with data-lead-form="true" (see index.html for a full
      example). The engine will auto-inject hidden tracking fields into it.
   3. Drop in your real IDs in the CONFIG block below. Nothing else in
      this file needs to change for a standard setup.
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     1. CONFIG  —  put your real tracking IDs here
     ======================================================================= */
  const CONFIG = {
    GTM_ID: "GTM-XXXXXXX",                 // Google Tag Manager container ID
    GA4_MEASUREMENT_ID: "G-XXXXXXXXXX",    // GA4 Measurement ID
    GOOGLE_ADS_ID: "AW-XXXXXXXX",          // Google Ads conversion ID
    GOOGLE_ADS_CONVERSION_LABEL: "CONVERSION_LABEL_HERE", // Google Ads conversion label
    META_PIXEL_ID: "META_PIXEL_ID_HERE",   // Meta (Facebook) Pixel ID
    CLARITY_PROJECT_ID: "CLARITY_PROJECT_ID_HERE", // Microsoft Clarity project ID
    UET_TAG_ID: "UET_TAG_ID_HERE",         // Microsoft Advertising (UET) tag ID

    // Where the visitor goes after a successful submission
    THANK_YOU_URL: "thank-you.html",

    // sessionStorage key used to persist tracking data across pages
    STORAGE_KEY: "leadTrackingData",

    // sessionStorage key used to make sure conversion events fire exactly
    // once per lead, even if both the AJAX submit path AND the thank-you
    // page's on-load check are active (see fireConversionEventsOnce).
    CONVERTED_FLAG_KEY: "leadConversionFired",
  };

  /* =======================================================================
     2. PARAMETERS WE CAPTURE
     ======================================================================= */
  // Standard UTM parameters
  const UTM_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "utm_id",
  ];

  // Ad-platform click IDs (used for offline / enhanced conversions)
  const CLICK_ID_KEYS = [
    "gclid",   // Google Ads
    "gbraid",  // Google Ads (iOS app-to-web, privacy sandbox)
    "wbraid",  // Google Ads (web-to-app, privacy sandbox)
    "fbclid",  // Meta / Facebook
    "msclkid", // Microsoft Ads
  ];

  const ALL_QUERY_KEYS = UTM_KEYS.concat(CLICK_ID_KEYS);

  /* =======================================================================
     3. CAPTURE + PERSIST
     ======================================================================= */
  const LeadTracking = {
    /**
     * Reads existing session data (if any), merges in any new tracking
     * params found in the current URL, and writes the result back to
     * sessionStorage. Designed to be safe to call on every page load.
     */
    init: function () {
      const existing = this._readStorage();
      const fromUrl = this._readUrlParams();

      const merged = Object.assign({}, existing);

      // Only overwrite a stored value if the URL actually supplies a new
      // one. This means the FIRST touch's attribution values survive even
      // if the visitor lands again later on a link with fewer/no params
      // (e.g. an internal link, a bookmarked page, etc).
      ALL_QUERY_KEYS.forEach(function (key) {
        if (fromUrl[key]) {
          merged[key] = fromUrl[key];
        }
      });

      // Referrer: capture once, on true first entry to the site this
      // session. document.referrer is only meaningful on that first hit,
      // so we only ever write it if nothing is stored yet.
      if (!existing.referrer) {
        merged.referrer = document.referrer || "(direct)";
      }

      // Landing page / first page: the very first URL of this session.
      if (!existing.landing_page) {
        merged.landing_page = window.location.href;
      }
      if (!existing.first_page) {
        merged.first_page = window.location.pathname;
      }

      // Current page: always refreshed to reflect where the visitor is now.
      merged.current_page = window.location.pathname;

      // First-touch timestamp, useful for CRM / offline conversion imports.
      if (!existing.session_start) {
        merged.session_start = new Date().toISOString();
      }

      this._writeStorage(merged);
      this._populateForms(merged);
    },

    /** Returns the full tracking data object currently in sessionStorage. */
    getData: function () {
      return this._readStorage();
    },

    /* ---------------------------------------------------------------------
       Internal helpers
       ------------------------------------------------------------------- */
    _readUrlParams: function () {
      const params = new URLSearchParams(window.location.search);
      const out = {};
      ALL_QUERY_KEYS.forEach(function (key) {
        const val = params.get(key);
        if (val) out[key] = val;
      });
      return out;
    },

    _readStorage: function () {
      try {
        const raw = sessionStorage.getItem(CONFIG.STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        console.warn("[LeadTracking] Could not read sessionStorage:", e);
        return {};
      }
    },

    _writeStorage: function (data) {
      try {
        sessionStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn("[LeadTracking] Could not write sessionStorage:", e);
      }
    },

    /**
     * Finds every form marked data-lead-form="true" and injects/updates
     * hidden <input> fields for each tracking value. Safe to call
     * repeatedly (e.g. on SPA route changes) — it will update existing
     * hidden inputs rather than duplicating them.
     */
    _populateForms: function (data) {
      const forms = document.querySelectorAll('[data-lead-form="true"]');
      forms.forEach(function (form) {
        Object.keys(data).forEach(function (key) {
          let input = form.querySelector('input[name="' + key + '"]');
          if (!input) {
            input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            form.appendChild(input);
          }
          input.value = data[key] || "";
        });
      });
    },
  };

  // Run capture immediately, then again once the DOM is ready (covers forms
  // that are rendered after this script tag, e.g. at the bottom of <body>
  // or injected by another script).
  LeadTracking.init();
  document.addEventListener("DOMContentLoaded", function () {
    LeadTracking.init();
  });

  /* =======================================================================
     4. FORM SUBMISSION HANDLING
     ======================================================================= */
  document.addEventListener("submit", function (event) {
    const form = event.target;
    if (!form.matches || !form.matches('[data-lead-form="true"]')) return;

    // Make sure hidden fields reflect the latest data right before submit,
    // in case anything changed since page load (e.g. current_page on an
    // SPA route change).
    LeadTracking._populateForms(LeadTracking.getData());

    // -----------------------------------------------------------------
    // OPTION A: Let the form submit normally to your backend
    // (Google Apps Script / EmailJS / Web3Forms / Netlify / FormSubmit /
    // your own CRM endpoint). In that case, do NOT preventDefault() —
    // instead handle success on the *receiving* page (thank-you.html
    // already fires all conversion events for you).
    //
    // OPTION B: Submit via fetch/AJAX so the page never reloads, then
    // redirect to the thank-you page yourself. This is what the demo
    // below does, since it works identically regardless of which backend
    // you wire up.
    // -----------------------------------------------------------------

    event.preventDefault();
    handleLeadSubmit(form);
  });

  /**
   * Generic async submit handler. Swap the fetch() call inside for
   * whichever backend you're using — the surrounding logic (disabling
   * the button, redirecting on success, showing an error otherwise)
   * stays the same.
   */
  function handleLeadSubmit(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : null;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    const formData = new FormData(form);

    // ---------------------------------------------------------------
    // BACKEND INTEGRATION POINT
    // Replace the block below with ONE of the following, depending on
    // which service you're using:
    //
    // — Google Apps Script (deployed as a web app):
    //     fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
    //       method: "POST", body: formData
    //     })
    //
    // — Web3Forms:
    //     formData.append("access_key", "YOUR_WEB3FORMS_ACCESS_KEY");
    //     fetch("https://api.web3forms.com/submit", {
    //       method: "POST", body: formData
    //     })
    //
    // — FormSubmit:
    //     fetch("https://formsubmit.co/ajax/YOUR_EMAIL", {
    //       method: "POST",
    //       headers: { Accept: "application/json" },
    //       body: formData
    //     })
    //
    // — Netlify Forms: (no fetch needed — let the native <form> submit,
    //     Netlify intercepts it automatically. Remove preventDefault()
    //     for this integration and instead redirect via the form's
    //     native `action` + a Netlify success page, or use Netlify's
    //     fetch-based AJAX pattern.)
    //
    // — EmailJS:
    //     emailjs.sendForm("SERVICE_ID", "TEMPLATE_ID", form)
    //
    // — Your own CRM / API:
    //     fetch("https://your-api.example.com/leads", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(Object.fromEntries(formData))
    //     })
    // ---------------------------------------------------------------

    // DEMO STAND-IN: simulates a successful network request.
    // Delete this block once a real endpoint above is wired in.
    const simulatedRequest = Promise.resolve({ ok: true });

    simulatedRequest
      .then(function (response) {
        if (!response.ok) throw new Error("Submission failed");
        onLeadSubmitSuccess(form);
      })
      .catch(function (err) {
        console.error("[LeadTracking] Submission error:", err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
        const errorEl = form.querySelector("[data-form-error]");
        if (errorEl) {
          errorEl.textContent =
            "Something went wrong. Please try again or contact us directly.";
          errorEl.hidden = false;
        }
      });
  }

  /**
   * Runs once the lead has been successfully captured by your backend.
   * Fires every ad-platform conversion event, then redirects to the
   * thank-you page carrying the tracking params along in the URL as a
   * belt-and-suspenders backup to sessionStorage (some ad-blockers or
   * privacy modes can restrict sessionStorage across a hard redirect).
   */
  function onLeadSubmitSuccess(form) {
    const data = LeadTracking.getData();

    fireConversionEventsOnce(data, form);

    // Build the thank-you URL, appending tracking params as a query
    // string fallback so the destination page can re-hydrate them even
    // if sessionStorage doesn't persist (e.g. cross-domain redirect).
    const params = new URLSearchParams();
    Object.keys(data).forEach(function (key) {
      if (data[key]) params.set(key, data[key]);
    });

    const separator = CONFIG.THANK_YOU_URL.indexOf("?") === -1 ? "?" : "&";
    window.location.href =
      CONFIG.THANK_YOU_URL + separator + params.toString();
  }

  /* =======================================================================
     5. CONVERSION EVENT PLACEHOLDERS
     -----------------------------------------------------------------------
     These fire on successful submission. Each block is independent —
     delete whichever platforms you don't use. All are safely no-ops if
     the corresponding platform script isn't loaded (guarded with typeof
     checks) so this file never throws even before you've added the
     platform snippets to index.html.
     ======================================================================= */
  function fireConversionEventsOnce(data, form) {
    try {
      if (sessionStorage.getItem(CONFIG.CONVERTED_FLAG_KEY) === "true") {
        return; // Already fired — e.g. thank-you.html beat us to it.
      }
      sessionStorage.setItem(CONFIG.CONVERTED_FLAG_KEY, "true");
    } catch (e) {
      // If sessionStorage is unavailable, fall through and fire anyway
      // rather than silently dropping the conversion.
    }
    fireConversionEvents(data, form);
  }

  function fireConversionEvents(data, form) {
    // -------------------- GOOGLE ADS CONVERSION ------------------------
    // Requires the global gtag.js snippet (see index.html <head>).
    if (typeof gtag === "function") {
      gtag("event", "conversion", {
        send_to: CONFIG.GOOGLE_ADS_ID + "/" + CONFIG.GOOGLE_ADS_CONVERSION_LABEL,
        // Enhanced Conversions: pass hashed/plain user data here if you
        // collect email/phone on the form, e.g.:
        // email: form.querySelector('[name="email"]')?.value,
        // phone_number: form.querySelector('[name="phone"]')?.value,
      });
    }

    // -------------------- GA4 "generate_lead" EVENT ---------------------
    if (typeof gtag === "function") {
      gtag("event", "generate_lead", {
        currency: "USD",
        value: 0, // set an estimated lead value if you have one
        utm_source: data.utm_source || "",
        utm_medium: data.utm_medium || "",
        utm_campaign: data.utm_campaign || "",
      });
    }

    // -------------------- GTM dataLayer push ----------------------------
    // Lets GTM triggers (rather than hardcoded gtag calls above) fire
    // any of the above, plus anything else configured in the container.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "lead_form_submit",
      lead_data: data,
    });

    // -------------------- META PIXEL "Lead" EVENT -----------------------
    if (typeof fbq === "function") {
      fbq("track", "Lead");
    }

    // -------------------- MICROSOFT UET CONVERSION ----------------------
    if (typeof uetq !== "undefined") {
      window.uetq = window.uetq || [];
      window.uetq.push("event", "submit_lead_form", {
        event_category: "Lead",
        event_label: "Landing Page Form",
        event_value: 0,
      });
    }

    // -------------------- MICROSOFT CLARITY -----------------------------
    // Clarity auto-tracks page views once installed (see index.html
    // <head>); this custom event tags the session as a converted lead so
    // you can filter recordings/heatmaps by conversions in the Clarity
    // dashboard.
    if (typeof clarity === "function") {
      clarity("event", "lead_submitted");
    }
  }

  /**
   * Called on thank-you.html to hydrate sessionStorage from the query
   * string fallback (belt-and-suspenders in case sessionStorage didn't
   * survive the redirect) and fire conversion events if the AJAX submit
   * path on the previous page hasn't already fired them. Safe to call
   * unconditionally on page load — it's a no-op if events already fired.
   */
  LeadTracking.fireThankYouConversions = function () {
    // Merge any tracking values present in the thank-you URL's query
    // string into whatever is already in sessionStorage.
    const params = new URLSearchParams(window.location.search);
    const existing = this._readStorage();
    const merged = Object.assign({}, existing);
    params.forEach(function (value, key) {
      if (value) merged[key] = value;
    });
    merged.current_page = window.location.pathname;
    this._writeStorage(merged);

    fireConversionEventsOnce(merged, null);
    return merged;
  };

  // Expose for debugging / advanced use (e.g. custom CRM scripts that
  // want to read the captured attribution data).
  window.LeadTracking = LeadTracking;
})();
