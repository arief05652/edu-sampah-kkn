/**
 * EduSampah — Visitor Counter
 *
 * 100% static — works on Cloudflare Pages, GitHub Pages, apa pun.
 * Menggunakan jsonblob.com sebagai backend penyimpanan (GRATIS, tanpa setup).
 */
(function () {
  'use strict';

  var BLOB_ID = '019f8384-28fb-73f6-969f-15e8294e2d80';
  var BLOB_URL = 'https://jsonblob.com/api/jsonBlob/' + BLOB_ID;
  var COUNTED_KEY = 'edusampah_counted';

  function updateDisplay(count) {
    var el = document.getElementById('visitorCount');
    if (el) {
      el.textContent = Number(count).toLocaleString('id-ID');
    }
  }

  function fetchCount() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', BLOB_URL, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          if (data && data.count !== undefined) {
            updateDisplay(data.count);
          }
        } catch (e) {}
      }
    };
    xhr.send();
  }

  function hitCount() {
    if (sessionStorage.getItem(COUNTED_KEY)) return;
    sessionStorage.setItem(COUNTED_KEY, '1');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', BLOB_URL, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          var newCount = (data.count || 0) + 1;
          updateDisplay(newCount);

          var put = new XMLHttpRequest();
          put.open('PUT', BLOB_URL, true);
          put.setRequestHeader('Content-Type', 'application/json');
          put.send(JSON.stringify({ count: newCount }));
        } catch (e) {}
      }
    };
    xhr.send();
  }

  if (document.readyState === 'complete') {
    fetchCount();
    hitCount();
  } else {
    window.addEventListener('load', function () {
      fetchCount();
      hitCount();
    });
  }
})();
