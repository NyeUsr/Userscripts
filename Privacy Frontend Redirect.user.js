// ==UserScript==
// @name        Privacy Frontend Redirect
// @match       *://*/*
// @exclude     *://account*/*
// @exclude     *://messages.*/*
// @grant       none
// @version     3.2.7
// @author      NoUser
// @description This script redirects to privacy friendly front-ends of popular services, such as YouTube, Twitter, Reddit, Imgur, Instagram, TikTok, etc. Additionally, it replaces iframes and outgoing links to non frontend services with their privacy-friendly counterparts. The purpose of this script is to protect the user's privacy by avoiding the collection of personal data by these services.
// @run-at      document-start
// @namespace   https://greasyfork.org/en/scripts/458875-privacy-frontend-redirect
// @homepage    https://greasyfork.org/en/scripts/458875-privacy-frontend-redirect
// @license     MIT
// ==/UserScript==

const hostname = window.location.hostname;
const hosts = {
  "www.youtube.com": ["invidious.privacydev.net", "vid.puffyan.us", "inv.vern.cc", "invidious.kavin.rocks", "invidious.tiekoetter.com", "inv.riverside.rocks", "iv.ggtyler.dev", "invidious.namazso.eu", "invidious.nerdvpn.de", "tube.cadence.moe"],
  "www.youtube-nocookie.com": ["invidious.privacydev.net", "vid.puffyan.us", "inv.vern.cc", "invidious.kavin.rocks", "invidious.tiekoetter.com", "inv.riverside.rocks", "iv.ggtyler.dev", "invidious.namazso.eu", "invidious.nerdvpn.de", "tube.cadence.moe"],
  "m.youtube.com": ["invidious.privacydev.net", "vid.puffyan.us", "inv.vern.cc", "invidious.kavin.rocks", "invidious.tiekoetter.com", "inv.riverside.rocks", "iv.ggtyler.dev", "invidious.namazso.eu", "invidious.nerdvpn.de", "tube.cadence.moe"],
  "twitter.com": ["nitter.sneed.network", "canada.unofficialbird.com", "nitter.privacytools.io", "nitter.foss.wtf", "nitter.privacy.com.de", "nitter.1d4.us", "nitter.poast.org", "twitter.censors.us"],
  "mobile.twitter.com": ["nitter.sneed.network", "canada.unofficialbird.com", "nitter.privacytools.io", "nitter.foss.wtf", "nitter.privacy.com.de", "nitter.1d4.us", "nitter.poast.org", "twitter.censors.us"],
  "www.reddit.com": ["libreddit.eu.org", "libreddit.spike.codes", "lr.odyssey346.dev", "rd.funami.tech", "libreddit.dcs0.hu", "lr.vern.cc", "www.troddit.com"],
  "imgur.com": ["rimgo.pussthecat.org", "rimgo.totaldarkness.net", "rimgo.vern.cc", "imgur.artemislena.eu", "rimgo.privacydev.net", "rimgo.bus-hit.me"],
  "i.imgur.com": ["rimgo.pussthecat.org", "rimgo.totaldarkness.net", "rimgo.vern.cc", "imgur.artemislena.eu", "rimgo.privacydev.net", "rimgo.bus-hit.me"],
  "i.stack.imgur.com": ["rimgo.pussthecat.org", "rimgo.totaldarkness.net", "rimgo.vern.cc", "imgur.artemislena.eu", "rimgo.privacydev.net", "rimgo.bus-hit.me"],
  "www.instagram.com": ["bibliogram.froth.zone", "ig.tokhmi.xyz", "bibliogram.priv.pw"],
  "www.tiktok.com": ["proxitok.pussthecat.org", "tok.habedieeh.re", "tok.artemislena.eu", "proxitok.privacydev.net"],
  "www.imdb.com": ["ld.vern.cc", "libremdb.esmailelbob.xyz", "lmdb.tokhmi.xyz", "libremdb.iket.me", "libremdb.pussthecat.org"],
  "translate.google.com": ["lingva.ml", "translate.plausibility.cloud", "lingva.lunar.icu", "translate.projectsegfau.lt", "translate.jae.fi"],
  "medium.com": ["scribe.rip", "scribe.nixnet.services", "scribe.citizen4.eu", "scribe.bus-hit.me", "scribe.froth.zone", "scribe.rawbit.ninja"],
};

const getReplacement = (host) => {
  if (!(host in hosts)) {
    console.log(`No replacement found for host: ${host}`);
  }
  let replacement = hosts[host];
  if (Array.isArray(replacement)) {
    replacement = replacement[Math.floor(Math.random() * replacement.length)];
  }
  return replacement;
};

const replaceUrl = (url, host) => {
  try {
    const replacement = getReplacement(host);
    if (replacement) {
      return url.replace(host, replacement);
    }
  } catch (error) {
    console.error(error.message);
  }
  return url;
};

try {
  if (getReplacement(hostname)) {
    window.location.href = replaceUrl(window.location.href, hostname);
  }
} catch (error) {
  console.error(error.message);
}


window.addEventListener("load", function () {
  try {
    // Replace iframes
    const iframes = document.getElementsByTagName("iframe");
    Array.from(iframes).forEach(iframe => {
      try {
        let src = iframe.src;
        let url = new URL(src);
        let host = url.host;
        iframe.src = replaceUrl(src, host);
      } catch (error) {
        console.error(error.message);
      }
    });

    // Replace hrefs
    const links = document.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
      let link = links[i];
      let href = link.href;
      let url = new URL(href);
      let host = url.host;
      if (host in hosts) {
        let replacement = hosts[host];
        if (Array.isArray(replacement)) {
          replacement = replacement[Math.floor(Math.random() * replacement.length)];
        }
        link.href = href.replace(host, replacement);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
});
