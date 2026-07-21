/**
 * EduSampah — Visitor Counter (Static)
 * 
 * Menggunakan countapi.xyz — layanan counter API gratis (open API, no backend needed).
 * Bekerja 100% client-side, cocok untuk static site / GitHub Pages.
 */
(function () {
  'use strict';

  const NAMESPACE = 'edusampah';
  const KEY = 'visitors';
  const API_BASE = 'https://api.countapi.xyz';
  const COUNTED_KEY = 'edusampah_counted';

  function updateDisplay(count) {
    const el = document.getElementById('visitorCount');
    if (el) {
      el.textContent = Number(count).toLocaleString('id-ID');
    }
  }

  // Ambil jumlah pengunjung saat ini
  function fetchCount() {
    fetch(API_BASE + '/get/' + NAMESPACE + '/' + KEY)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.value !== undefined) updateDisplay(data.value);
      })
      .catch(function () {});
  }

  // Hitung kunjungan baru (sekali per session)
  function hitCount() {
    if (sessionStorage.getItem(COUNTED_KEY)) return;
    sessionStorage.setItem(COUNTED_KEY, '1');

    fetch(API_BASE + '/hit/' + NAMESPACE + '/' + KEY, { method: 'POST' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.value !== undefined) updateDisplay(data.value);
      })
      .catch(function () {});
  }

  // Jalankan setelah halaman selesai dimuat
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
