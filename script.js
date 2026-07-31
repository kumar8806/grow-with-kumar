<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Ridgeline Ops &mdash; Fractional Operations Partners</title>
<meta name="description" content="Fractional operations leadership for growing teams. Book a fit call." />

<!-- =====================================================================
     PWA / ICON METADATA
     ===================================================================== -->
<link rel="manifest" href="manifest.json" />
<link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon-32.png" />
<link rel="icon" type="image/png" sizes="192x192" href="assets/icons/icon-192.png" />
<link rel="apple-touch-icon" href="assets/icons/icon-192.png" />
<meta name="theme-color" content="#0B1220" />

<!-- =====================================================================
     GOOGLE TAG MANAGER (head snippet)
     Replace GTM-XXXXXXX with your real container ID.
     GTM is the recommended place to manage GA4, Google Ads, Meta Pixel,
     and UET tags long-term — the direct snippets below are included too
     so this page works immediately even before you've built out a GTM
     container, and so `gtag`, `fbq`, `uetq`, and `clarity` calls in
     tracking.js resolve without needing GTM configured yet.
     ===================================================================== -->
<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX'); /* <-- your GTM ID */
</script>

<!-- =====================================================================
     GOOGLE ANALYTICS 4  +  GOOGLE ADS (gtag.js)
     Replace G-XXXXXXXXXX with your GA4 Measurement ID.
     Replace AW-XXXXXXXX with your Google Ads Conversion ID.
     Both can share one gtag.js loader — just add a second `config` line.
     ===================================================================== -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');   /* <-- your GA4 Measurement ID */
  gtag('config', 'AW-XXXXXXXX');    /* <-- your Google Ads Conversion ID */
</script>

<!-- =====================================================================
     META PIXEL
     Replace META_PIXEL_ID_HERE with your Pixel ID.
     ===================================================================== -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'META_PIXEL_ID_HERE');   /* <-- your Meta Pixel ID */
fbq('track', 'PageView');
</script>

<!-- =====================================================================
     MICROSOFT CLARITY
     Replace CLARITY_PROJECT_ID_HERE with your Clarity project ID.
     Clarity auto-fires page views on load — no extra call needed for that.
     ===================================================================== -->
<script type="text/javascript">
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "CLARITY_PROJECT_ID_HERE"); /* <-- your Clarity project ID */
</script>

<!-- =====================================================================
     MICROSOFT ADVERTISING (UET) TAG
     Replace UET_TAG_ID_HERE with your UET Tag ID.
     ===================================================================== -->
<script>
(function(w,d,t,r,u){
  w[u]=w[u]||[];w[u].push({'ti': "UET_TAG_ID_HERE"}); /* <-- your UET Tag ID */
  var f=d.getElementsByTagName(t)[0],s=d.createElement(t);
  s.src=r;s.async=1;s.onload=s.onreadystatechange=function(){
    var y,r=this.readyState;y=!r||r=="loaded"||r=="complete";
    if(y){try{w.uetq.push('pageLoad')}catch(e){}}
  };
  f.parentNode.insertBefore(s,f);
})(window,document,'script','//bat.bing.com/bat.js','uetq');
</script>

<!-- <noscript> fallback for GTM — required by GTM's own install docs -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

<!-- =====================================================================
     FONTS + STYLESHEET
     ===================================================================== -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css" />
</head>
<body>

<header>
  <div class="wrap nav">
    <div class="logo"><span class="logo-mark"></span>Ridgeline Ops</div>
    <a class="nav-cta" href="#lead-form">Book a fit call</a>
  </div>
</header>

<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <div class="eyebrow">Fractional Ops Partners</div>
      <h1>Run operations like <em>someone's</em><br>actually watching the dashboard.</h1>
      <p class="lede">
        Ridgeline places a senior operations lead inside your company,
        part-time, to fix the process gaps slowing your team down —
        without the cost of a full-time hire.
      </p>
      <div class="proof-row">
        <div class="proof-item"><b>38</b>teams supported</div>
        <div class="proof-item"><b>6&nbsp;wks</b>avg. time to impact</div>
        <div class="proof-item"><b>4.9/5</b>client rating</div>
      </div>
    </div>

    <!-- =================================================================
         LEAD FORM
         data-lead-form="true" is what tells tracking.js to manage this
         form: inject hidden tracking fields, intercept submit, fire
         conversion events, and redirect to the thank-you page.

         Hidden tracking fields are injected AUTOMATICALLY by tracking.js
         — you do not need to add them by hand. They are added right
         before this comment closes, one per captured parameter:
         utm_source, utm_medium, utm_campaign, utm_term, utm_content,
         utm_id, gclid, gbraid, wbraid, fbclid, msclkid, referrer,
         landing_page, first_page, current_page.
         ================================================================= -->
    <div class="form-panel" id="lead-form">
      <h2>Get your fit assessment</h2>
      <p class="form-sub">15-minute call. No deck, no pitch — just a straight answer on fit.</p>

      <form data-lead-form="true" id="leadForm">
        <div class="field">
          <label for="name">Full name</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div class="field">
          <label for="email">Work email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div class="field">
          <label for="phone">Phone</label>
          <input type="tel" id="phone" name="phone" />
        </div>
        <div class="field">
          <label for="message">What's the biggest operational bottleneck right now?</label>
          <textarea id="message" name="message"></textarea>
        </div>

        <!-- Hidden UTM / click-ID / attribution fields are auto-injected
             here by tracking.js at runtime. -->

        <button type="submit" class="submit-btn">Request my fit call</button>
        <p class="form-error" data-form-error></p>
        <p class="form-fineprint">
          By submitting, you agree to be contacted about Ridgeline's
          services. We don't share your info with third parties.
        </p>
      </form>

      <!-- =============================================================
           ATTRIBUTION DEBUG PANEL (optional, safe to delete)
           Behavior lives in js/script.js. Reads live from
           window.LeadTracking so you can visually confirm UTM/click-ID
           capture while testing campaign links, before sending real ad
           traffic here.
           ============================================================= -->
      <div class="debug-panel">
        <button type="button" class="debug-toggle" id="debugToggle">
          <span>▸ Attribution data captured this session</span>
          <span id="debugCount">0 values</span>
        </button>
        <div class="debug-body" id="debugBody"></div>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <h2>What a fractional ops lead actually does</h2>
    <p class="sub">Not advice. Not a workshop. Someone who sits in your systems and fixes what's broken.</p>
    <div class="grid-3">
      <div class="card">
        <div class="num">01</div>
        <h3>Process audit</h3>
        <p>Two weeks mapping how work actually moves through your team, versus how you think it moves.</p>
      </div>
      <div class="card">
        <div class="num">02</div>
        <h3>Systems cleanup</h3>
        <p>Consolidate the tools you're paying for, kill the ones nobody uses, and wire the rest together.</p>
      </div>
      <div class="card">
        <div class="num">03</div>
        <h3>Ongoing ownership</h3>
        <p>Weekly check-ins and a standing owner for operations, so fixes don't quietly unravel in month three.</p>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">
    Ridgeline Ops &mdash; this page is a demo template for lead-tracking architecture.
  </div>
</footer>

<!-- =====================================================================
     SCRIPTS
     tracking.js: the tracking engine (capture, storage, form fill,
       conversion events). Load first so window.LeadTracking exists.
     script.js: page-level UI only (debug panel). Depends on tracking.js.
     Both loaded at the end of <body> so the DOM (including the form
     above) exists before either runs.
     ===================================================================== -->
<script src="js/tracking.js"></script>
<script src="js/script.js"></script>

</body>
</html>
