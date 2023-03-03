// ==UserScript==
// @name        Privacy Frontend Redirect
// @match       *://*/*
// @exclude     *://account*/*
// @exclude     *://messages.*/*
// @grant       none
// @version     4.2.7
// @author      NoUser
// @description This script redirects to privacy friendly front-ends of popular services, such as YouTube, Twitter, Reddit, Imgur, Instagram, TikTok, etc. Additionally, it replaces iframes and outgoing links to non frontend services with their privacy-friendly counterparts. The purpose of this script is to protect the user's privacy by avoiding the collection of personal data by these services.
// @run-at      document-start
// @namespace   https://greasyfork.org/en/scripts/458875-privacy-frontend-redirect
// @homepage    https://greasyfork.org/en/scripts/458875-privacy-frontend-redirect
// @license     MIT
// ==/UserScript==

const hostname = window.location.hostname;
const hosts = {
  "www.youtube.com": ["invidious.privacydev.net", "vid.puffyan.us", "inv.vern.cc", "invidious.kavin.rocks", "invidious.tiekoetter.com", "inv.riverside.rocks", "iv.ggtyler.dev", "invidious.nerdvpn.de"],
  "www.youtube-nocookie.com": ["invidious.privacydev.net", "vid.puffyan.us", "inv.vern.cc", "invidious.kavin.rocks", "invidious.tiekoetter.com", "inv.riverside.rocks", "iv.ggtyler.dev", "invidious.nerdvpn.de"],
  "m.youtube.com": ["invidious.privacydev.net", "vid.puffyan.us", "inv.vern.cc", "invidious.kavin.rocks", "invidious.tiekoetter.com", "inv.riverside.rocks", "iv.ggtyler.dev", "invidious.nerdvpn.de"],
  "twitter.com": ["nitter.sneed.network", "canada.unofficialbird.com", "nitter.privacytools.io", "nitter.foss.wtf", "nitter.privacy.com.de", "nitter.1d4.us", "nitter.poast.org", "twitter.censors.us"],
  "mobile.twitter.com": ["nitter.sneed.network", "canada.unofficialbird.com", "nitter.privacytools.io", "nitter.foss.wtf", "nitter.privacy.com.de", "nitter.1d4.us", "nitter.poast.org", "twitter.censors.us"],
  "www.reddit.com": ["libreddit.eu.org", "libreddit.spike.codes", "lr.odyssey346.dev", "rd.funami.tech", "libreddit.dcs0.hu", "lr.vern.cc", "www.troddit.com"],
  "imgur.com": ["rimgo.pussthecat.org", "rimgo.totaldarkness.net", "rimgo.vern.cc", "imgur.artemislena.eu", "rimgo.privacydev.net", "rimgo.bus-hit.me"],
  "i.imgur.com": ["rimgo.pussthecat.org", "rimgo.totaldarkness.net", "rimgo.vern.cc", "imgur.artemislena.eu", "rimgo.privacydev.net", "rimgo.bus-hit.me"],
  "i.stack.imgur.com": ["rimgo.pussthecat.org", "rimgo.totaldarkness.net", "rimgo.vern.cc", "imgur.artemislena.eu", "rimgo.privacydev.net", "rimgo.bus-hit.me"],
  "www.instagram.com": ["bibliogram.froth.zone", "ig.tokhmi.xyz"],
  "www.tiktok.com": ["proxitok.pussthecat.org", "tok.habedieeh.re", "tok.artemislena.eu", "proxitok.privacydev.net"],
  "www.imdb.com": ["ld.vern.cc", "libremdb.esmailelbob.xyz", "lmdb.tokhmi.xyz", "libremdb.iket.me", "libremdb.pussthecat.org"],
  "translate.google.com": ["lingva.ml", "translate.plausibility.cloud", "lingva.lunar.icu", "translate.projectsegfau.lt", "translate.jae.fi"],
  "medium.com": ["scribe.rip", "scribe.nixnet.services", "scribe.citizen4.eu", "scribe.bus-hit.me", "scribe.froth.zone", "scribe.rawbit.ninja"],
};

const replaceUrl = (url) => {
  const { host } = new URL(url);
  if (host in hosts) {
    let replacement = hosts[host];
    if (Array.isArray(replacement)) {
      replacement = replacement[Math.floor(Math.random() * replacement.length)];
    }
    return url.replace(host, replacement);
  }
  return url;
};

try {
  const replacement = hosts[hostname];
  if (replacement) {
    window.location.href = replaceUrl(window.location.href);
  }
} catch (error) {
  console.error(error.message);
}

window.addEventListener("load", function () {
  try {
    // Replace iframes
    const iframes = document.querySelectorAll(`iframe[src*="${window.location.host}"]`);
    iframes.forEach(iframe => {
      const newIframe = document.createElement('iframe');
      const attributes = ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow', 'title'];
      attributes.forEach(attribute => {
        if (iframe.hasAttribute(attribute)) {
          newIframe.setAttribute(attribute, iframe.getAttribute(attribute));
        }
      });
      iframe.parentNode.replaceChild(newIframe, iframe);
    });

    // Replace hrefs
    const links = document.querySelectorAll("a");
    links.forEach(link => {
      const href = link.href;
      const newUrl = replaceUrl(href);
      if (newUrl !== href) {
        link.href = newUrl;
      }
    });
  } catch (error) {
    console.error(error.message);
  }
});
