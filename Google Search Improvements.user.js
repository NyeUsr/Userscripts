// ==UserScript==
// @name        Google Search Improvements
// @match       *://www.google.*/search*
// @grant       none
// @version     1.0.0
// @author      NoUser
// @description Remove tracking and unnecessary parameters from Google Search URLs. Keeps only essential params. Adds udm=14 if only 'q' remains.
// @run-at      document-start
// @license     MIT
// ==/UserScript==

const keep = new Set([
  "q", "udm", "tbm", "tbs", "hl", "gl", "lr", "cr", "safe", "start", "num"
]);

function cleanUrl() {
  const url = new URL(location.href);
  if (url.pathname !== "/search") return;

  const orig = url.searchParams;
  const next = new URLSearchParams();
  let kept = 0, changed = false;

  for (const [k, v] of orig) {
    if (keep.has(k)) {
      next.append(k, v);
      kept++;
    } else {
      changed = true;
    }
  }

  if (kept === 1 && next.has("q")) {
    next.set("udm", "14");
    changed = true;
  }

  if (changed) {
    const s = next.toString();
    const clean = url.origin + url.pathname + (s ? "?" + s : "");
    if (location.href !== clean) history.replaceState(null, "", clean);
  }
}

cleanUrl();

let tid;
const debounce = () => {
  clearTimeout(tid);
  tid = setTimeout(cleanUrl, 20);
};

new MutationObserver(debounce).observe(document.body || document.documentElement, {
  childList: true, subtree: true
});
addEventListener("popstate", debounce);
