# Lead Tracking Landing Page

## Folder structure

```
.
├── index.html          Landing page (markup only — styles/scripts external)
├── thank-you.html       Post-submit confirmation page
├── manifest.json        Web app manifest (PWA metadata, icons)
├── robots.txt            Crawl rules + sitemap pointer
├── sitemap.xml            Public URL for search engines
├── css/
│   └── style.css        All styling for both pages
├── js/
│   ├── tracking.js      Tracking engine — capture, storage, form
│   │                     injection, conversion events (edit CONFIG here)
│   └── script.js        Page UI only (attribution debug panel)
└── assets/
    └── icons/
        ├── favicon-32.png
        ├── icon-192.png
        └── icon-512.png
```

`tracking.js` and `script.js` are deliberately separate: `tracking.js` is
the reusable engine you'd carry into any funnel; `script.js` is
cosmetic page behavior specific to this template (safe to delete without
touching tracking).

## 1. Add your IDs (one place to edit)

Open **`js/tracking.js`** and fill in the `CONFIG` block near the top:

```js
const CONFIG = {
  GTM_ID: "GTM-XXXXXXX",
  GA4_MEASUREMENT_ID: "G-XXXXXXXXXX",
  GOOGLE_ADS_ID: "AW-XXXXXXXX",
  GOOGLE_ADS_CONVERSION_LABEL: "CONVERSION_LABEL_HERE",
  META_PIXEL_ID: "META_PIXEL_ID_HERE",
  CLARITY_PROJECT_ID: "CLARITY_PROJECT_ID_HERE",
  UET_TAG_ID: "UET_TAG_ID_HERE",
  ...
};
```

Then update the **same IDs** in the `<head>` of both `index.html` and
`thank-you.html` (search for each placeholder string — `GTM-XXXXXXX`,
`G-XXXXXXXXXX`, `AW-XXXXXXXX`, `META_PIXEL_ID_HERE`,
`CLARITY_PROJECT_ID_HERE`, `UET_TAG_ID_HERE` — each appears once per
page). The `CONFIG` object drives the conversion *events*; the `<head>`
snippets load the platform libraries those events call into. Keeping
both in sync is the only manual step.

## 2. How tracking capture works

On every page load, `js/tracking.js`:

1. Reads UTM params, `gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid` from
   the current URL (if present).
2. Merges them into whatever is already stored in `sessionStorage` under
   the key `leadTrackingData` — first-touch values are never overwritten
   by a later visit with fewer params.
3. Records `referrer`, `landing_page`, and `first_page` once, on true
   first entry; refreshes `current_page` on every load.
4. Injects all of the above as hidden `<input>` fields into any
   `<form data-lead-form="true">` on the page.

Nothing needs to change here for a standard setup — this is what makes
the values survive from the ad click through to form submission,
including across internal page navigation.

## 3. Wiring your form backend

`tracking.js` intercepts the form submit, but the actual "send this lead
somewhere" call is left as a clearly marked placeholder inside
`handleLeadSubmit()`. Find the comment block:

```
// BACKEND INTEGRATION POINT
```

and swap the demo `Promise.resolve(...)` for one real `fetch(...)` call.
Ready-made snippets are commented in for:

| Backend | Notes |
|---|---|
| Google Apps Script | Deploy as a web app, POST `formData` to the `/exec` URL |
| Web3Forms | Append your `access_key` to `formData` before posting |
| FormSubmit | POST to `https://formsubmit.co/ajax/you@example.com` |
| EmailJS | Use `emailjs.sendForm(...)` instead of `fetch` |
| Netlify Forms | Skip the AJAX path entirely — let the native `<form>` POST, Netlify intercepts it automatically |
| Custom CRM/API | POST JSON to your own endpoint |

Only one backend should be active at a time — uncomment the one you're
using and delete the rest.

## 4. What fires on conversion

Once the backend call resolves successfully, `tracking.js` fires (in
order): a Google Ads conversion, a GA4 `generate_lead` event, a
`dataLayer.push` for GTM-based triggers, a Meta Pixel `Lead` event, a
Microsoft UET `submit_lead_form` event, and a Clarity custom event —
then redirects to `thank-you.html` with the tracking data appended as a
query-string fallback.

`thank-you.html` also loads `js/tracking.js` and calls
`LeadTracking.fireThankYouConversions()` on load. This is deliberate: if
your chosen backend does a native form POST + server-side redirect
(Netlify Forms, FormSubmit, Apps Script) rather than AJAX, `index.html`'s
JS never gets a chance to fire events — so `thank-you.html` does it
instead. A `sessionStorage` flag (`leadConversionFired`) makes sure
events fire exactly once, however the redirect happens.

## 5. Enhanced Conversions / Offline Conversions

The Google Ads conversion call in `fireConversionEvents()` (inside
`js/tracking.js`) has a commented-out spot for Enhanced Conversions user
data (email, phone). Uncomment and map to your form's field names once
you're ready to turn that on in the Google Ads UI as well.

For offline conversion imports, every captured value (including
`gclid`/`gbraid`/`wbraid`) is available via `window.LeadTracking.getData()`
— pull it into whatever payload your CRM sends to your backend so it can
be matched back to the click at import time.

## 6. Debug panel

`index.html` includes a collapsible "Attribution data captured this
session" panel under the form; its behavior lives in `js/script.js`,
reading live from `window.LeadTracking.getData()`. Useful for QA-ing
campaign links before sending real spend at this page. Delete the
`.debug-panel` markup, its CSS block in `css/style.css`, and
`js/script.js`'s `renderDebugPanel` logic if you don't want it visible
to visitors.

## 7. SEO / PWA files

- **`robots.txt`** — allows full crawling, blocks `thank-you.html` from
  being indexed, and points to `sitemap.xml`. Update the domain.
- **`sitemap.xml`** — lists the one public page. Update the domain, and
  add more `<url>` entries if you add more public pages.
- **`manifest.json`** — enables "Add to Home Screen" behavior on mobile
  and gives the browser tab a proper icon/theme color. Points at the
  generated icons in `assets/icons/`.
- **`assets/icons/`** — placeholder icons in the page's signal-yellow
  brand mark. Swap these PNGs for your real logo at the same
  dimensions (32×32, 192×192, 512×512) whenever you have one.

## 8. Deploying

Everything here is static — upload the whole folder as-is to any static
host (Netlify, Vercel, GitHub Pages, S3, your own server). No build step
required. Just remember to replace the `example.com` domain in
`robots.txt` and `sitemap.xml` once you know your real one.
