import 'jest-canvas-mock';
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. MIT license */

window.matchMedia ||
  (window.matchMedia = (function() {
    'use strict';

    // For browsers that support matchMedium api such as IE 9 and webkit
    let styleMedia = window.styleMedia || window.media;

    // For those that don't support matchMedium
    if (!styleMedia) {
      const style = document.createElement('style'),
        script = document.getElementsByTagName('script')[0];
      let info = null;

      style.id = 'matchmediajs-test';

      if (!script) {
        document.head.appendChild(style);
      } else {
        script.parentNode.insertBefore(style, script);
      }

      // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
      info =
        ('getComputedStyle' in window &&
          window.getComputedStyle(style, null)) ||
        style.currentStyle;

      styleMedia = {
        matchMedium: function(media) {
          const text =
            '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

          // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
          if (style.styleSheet) {
            style.styleSheet.cssText = text;
          } else {
            style.textContent = text;
          }

          // Test if media query is true or false
          return info.width === '1px';
        },
      };
    }

    return function(media) {
      return {
        matches: styleMedia.matchMedium(media || 'all'),
        media: media || 'all',
      };
    };
  })());
