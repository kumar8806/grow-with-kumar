/* =========================================================================
   PAGE UI SCRIPT
   -------------------------------------------------------------------------
   Cosmetic/UI behavior only — the attribution debug panel on index.html.
   All actual tracking logic (capture, storage, form injection, conversion
   events) lives in js/tracking.js. Safe to delete this whole file (and
   the .debug-panel markup + CSS) if you don't want the debug panel in
   production.
   ========================================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("debugToggle");
  const body = document.getElementById("debugBody");

  if (toggleBtn && body) {
    toggleBtn.addEventListener("click", function () {
      body.classList.toggle("open");
      const label = body.classList.contains("open")
        ? "\u25BE Attribution data captured this session"
        : "\u25B8 Attribution data captured this session";
      this.querySelector("span").textContent = label;
    });
  }

  renderDebugPanel();
  window.addEventListener("load", renderDebugPanel);
});

/**
 * Reads the current tracking data from window.LeadTracking (exposed by
 * tracking.js) and renders it into the debug panel so you can visually
 * confirm UTM / click-ID capture while testing campaign links.
 */
function renderDebugPanel() {
  const countEl = document.getElementById("debugCount");
  const bodyEl = document.getElementById("debugBody");
  if (!countEl || !bodyEl) return;

  const data = (window.LeadTracking && window.LeadTracking.getData()) || {};
  const keys = Object.keys(data).filter(function (k) {
    return data[k];
  });

  countEl.textContent = keys.length + " values";

  bodyEl.innerHTML =
    keys
      .map(function (k) {
        return (
          '<div class="debug-row"><span>' +
          k +
          "</span><span>" +
          data[k] +
          "</span></div>"
        );
      })
      .join("") ||
    '<div class="debug-row"><span>\u2014</span><span>no params on this visit yet</span></div>';
}
