// ==UserScript==
// @name        Quicklink Loader
// @match       *://*/*
// @grant       none
// @version     1.1.2
// @author      NoUser
// @description Quicklink is a JavaScript library that speeds up subsequent page loads by intelligently prefetching resources. This userscript adds Quicklink to every webpage, preloading links that the user is likely to click. By prefetching these resources, the next page loads faster, improving the overall browsing experience.
// @namespace   https://greasyfork.org/en/scripts/459274-quicklink-loader
// @homepage    https://greasyfork.org/en/scripts/459274-quicklink-loader
// @require     https://cdnjs.cloudflare.com/ajax/libs/quicklink/2.3.0/quicklink.umd.js
// @license MIT
// ==/UserScript==

// Test on
// https://mini-ecomm.glitch.me/

const ignore = [
  // Ignore all api urls
  /\/api\/?/,
  /^api\./,
  // Ignore login/signup urls
  /\/(sign|log)\/?/,
  // Ignore urls that contain the word "video"
  uri => uri.includes('video'),
  // Don't prefetch links with dom selectors
  uri => uri.includes('#'),
  // Don't prefetch these file types
  uri => ['.zip', '.tar', '.7z', '.rar', '.json', '.apk', '.xapk', '.woff2', '.tff', '.otf', '.pdf', '.mp3', '.mp4', '.wav', '.exe', '.msi', '.bat', '.deb', '.rpm', '.bin', '.dmg', '.iso', '.csv', '.log', '.sql', '.xml', '.key', '.odp', '.ods', '.pps', '.ppt', '.xls', '.doc'].some(ext => uri.includes(ext)),
  // Don't prefetch these protocols
  uri => ['http:', 'file:', 'ftp:', 'mailto:', 'tel:'].some(protocol => uri.includes(protocol)),
  // Ignore all links, scripts which has explicit noprefetch
  (uri, elem) => elem.hasAttribute('noprefetch'),
];


quicklink.listen({ origins: true, limit: 15, ignores: ignore });
