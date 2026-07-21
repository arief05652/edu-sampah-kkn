/**
 * EduSampah — Visitor Counter
 * Bekerja dengan server lokal (server.js). Fully open-source, zero dependency.
 * 
 * Cara pakai:
 *   1. Jalankan server: node server.js
 *   2. Buka http://localhost:3000
 */
(function () {
  'use strict';

  var COUNTER_API = '/api/counter';
  var COUNTED_KEY = 'edusampah_counted';

  function updateDisplay(count) {
    var el = document.getElementById('visitorCount');
    if (el) {
      el.textContent = Number(count).toLocaleString('id-ID');
    }
  }

  // Ambil jumlah pengunjung
  function fetchCount() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', COUNTER_API, true);
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

  // Hit kunjungan baru (sekali per session)
  function hitCount() {
    if (sessionStorage.getItem(COUNTED_KEY)) return;
    sessionStorage.setItem(COUNTED_KEY, '1');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', COUNTER_API, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
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

  // Jalankan
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
