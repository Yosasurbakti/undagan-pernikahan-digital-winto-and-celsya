/* =========================================================================
   UNDANGAN PERNIKAHAN DIGITAL — Winto & Chelsya
   script.js — vanilla JS, tanpa dependency luar, dioptimalkan agar ringan
   dan mulus di HP, laptop, maupun PC.
   ========================================================================= */
(() => {
  'use strict';

  /* -----------------------------------------------------------------
     0. KONFIGURASI — silakan ubah bagian ini sesuai kebutuhan Anda
     ----------------------------------------------------------------- */
  const CONFIG = {
    coupleGroom: 'Winto',
    coupleBride: 'Chelsya',
    // Jika Anda punya Google Apps Script / SheetDB untuk menyimpan ucapan
    // secara online (agar tersimpan permanen & bisa dilihat semua tamu),
    // isi URL endpoint-nya di sini. Jika dikosongkan, ucapan akan
    // disimpan secara lokal di browser tamu masing-masing (mode demo).
    wishesApiUrl: '',
    // Jumlah foto galeri yang dicari otomatis di assets/images/gallery-1.jpg dst.
    galleryCount: 8,
    // Detail acara untuk tombol "Tambah ke Kalender"
    events: {
      akad: {
        title: 'Akad Nikah — Winto & Chelsya',
        start: '2026-12-12T08:00:00+07:00',
        end:   '2026-12-12T10:00:00+07:00',
        location: 'Mertoyudan, Kabupaten Magelang, Jawa Tengah',
      },
      resepsi: {
        title: 'Resepsi Pernikahan — Winto & Chelsya',
        start: '2026-12-12T11:00:00+07:00',
        end:   '2026-12-12T14:00:00+07:00',
        location: 'Mertoyudan, Kabupaten Magelang, Jawa Tengah',
      },
    },
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* -----------------------------------------------------------------
     1. PRELOADER
     ----------------------------------------------------------------- */
  function initPreloader() {
    const el = $('#preloader');
    const hide = () => el && el.classList.add('is-hidden');
    if (document.readyState === 'complete') {
      setTimeout(hide, 400);
    } else {
      window.addEventListener('load', () => setTimeout(hide, 400), { once: true });
      // fallback safety net in case 'load' is delayed by slow assets
      setTimeout(hide, 2500);
    }
  }

  /* -----------------------------------------------------------------
     2. NAMA TAMU DARI QUERY STRING  (?to=Nama%20Tamu)
     ----------------------------------------------------------------- */
  function initGuestName() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('to') || params.get('nama');
    const target = $('#guestName');
    if (raw && target) {
      target.textContent = decodeURIComponent(raw.replace(/\+/g, ' '));
    }
  }

  /* -----------------------------------------------------------------
     3. BUKA AMPLOP  →  buka konten, kunci-scroll dilepas, musik main
     ----------------------------------------------------------------- */
  function initEnvelope() {
    const openBtn = $('#openBtn');
    const cover = $('#cover');
    const envelope = $('#envelopeFlap');
    const main = $('#mainContent');
    const music = $('#bgMusic');
    const musicToggle = $('#musicToggle');

    document.body.classList.add('no-scroll');

    if (!openBtn) return;

    openBtn.addEventListener('click', () => {
      openBtn.classList.add('is-opening');
      envelope.classList.add('is-active');

      // coba putar musik (dipicu oleh gesture user, jadi diizinkan browser)
      if (music) {
        music.volume = 0.55;
        music.play().then(() => {
          musicToggle.classList.add('is-playing');
          musicToggle.setAttribute('aria-pressed', 'true');
          $('.music-toggle__icon-pause').hidden = false;
          $('.music-toggle__icon-play').hidden = true;
        }).catch(() => { /* diamkan bila browser tetap memblokir */ });
      }

      setTimeout(() => {
        cover.classList.add('is-open');
        document.body.classList.remove('no-scroll');
        main.removeAttribute('aria-hidden');
        main.setAttribute('tabindex', '-1');
        main.focus({ preventScroll: true });
      }, 550);

      setTimeout(() => { cover.style.display = 'none'; }, 1600);
    }, { once: true });
  }

  /* -----------------------------------------------------------------
     4. TOMBOL MUSIK
     ----------------------------------------------------------------- */
  function initMusicToggle() {
    const btn = $('#musicToggle');
    const music = $('#bgMusic');
    if (!btn || !music) return;
    const playIcon = $('.music-toggle__icon-play');
    const pauseIcon = $('.music-toggle__icon-pause');

    btn.addEventListener('click', () => {
      if (music.paused) {
        music.play().catch(() => {});
        btn.classList.add('is-playing');
        btn.setAttribute('aria-pressed', 'true');
        playIcon.hidden = true;
        pauseIcon.hidden = false;
      } else {
        music.pause();
        btn.classList.remove('is-playing');
        btn.setAttribute('aria-pressed', 'false');
        playIcon.hidden = false;
        pauseIcon.hidden = true;
      }
    });
  }

  /* -----------------------------------------------------------------
     5. SCROLL REVEAL — IntersectionObserver (ringan & efisien)
     ----------------------------------------------------------------- */
  function initScrollReveal() {
    const items = $$('[data-reveal]');
    if (!items.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    items.forEach((el) => io.observe(el));
  }

  /* -----------------------------------------------------------------
     6. COUNTDOWN — dengan animasi flip 3D setiap angka berubah
     ----------------------------------------------------------------- */
  function initCountdown() {
    const wrap = $('#countdown');
    if (!wrap) return;
    const target = new Date(wrap.dataset.target).getTime();

    const els = {
      days: $('#cdDays'), hours: $('#cdHours'),
      minutes: $('#cdMinutes'), seconds: $('#cdSeconds'),
    };
    const prev = { days: '', hours: '', minutes: '', seconds: '' };

    function update() {
      const now = Date.now();
      let diff = Math.max(0, target - now);

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      const vals = {
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      };

      Object.keys(vals).forEach((key) => {
        const el = els[key];
        if (!el) return;
        if (vals[key] !== prev[key]) {
          el.textContent = vals[key];
          if (!prefersReducedMotion) {
            el.classList.remove('is-flipping');
            // force reflow supaya animasi bisa diulang
            void el.offsetWidth;
            el.classList.add('is-flipping');
          }
          prev[key] = vals[key];
        }
      });

      if (diff <= 0) clearInterval(timer);
    }

    update();
    const timer = setInterval(update, 1000);
  }

  /* -----------------------------------------------------------------
     7. GALERI — bangun grid otomatis + fallback bila gambar belum ada
     ----------------------------------------------------------------- */
  function initGallery() {
    const grid = $('#galleryGrid');
    if (!grid) return;

    const photos = [];
    for (let i = 1; i <= CONFIG.galleryCount; i++) {
      const btn = document.createElement('button');
      btn.className = 'gallery-item';
      btn.type = 'button';
      btn.setAttribute('aria-label', `Buka foto ${i}`);

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = `Momen ${CONFIG.coupleGroom} & ${CONFIG.coupleBride} ${i}`;
      img.src = `assets/images/gallery-${i}.jpg`;
      img.onerror = () => {
        // placeholder elegan bila foto belum diunggah pengguna
        img.onerror = null;
        img.src = buildPlaceholderSVG(i);
      };

      btn.appendChild(img);
      btn.addEventListener('click', () => openLightbox(photos, i - 1));
      grid.appendChild(btn);
      photos.push(img.src);
    }

    // update array `photos` supaya lightbox pakai src final (termasuk placeholder)
    grid.addEventListener('load', () => {}, true);
    grid.querySelectorAll('img').forEach((img, idx) => {
      img.addEventListener('load', () => { photos[idx] = img.src; }, { once: true });
      img.addEventListener('error', () => { photos[idx] = img.src; }, { once: true });
    });

    grid.__photos = photos;
  }

  function buildPlaceholderSVG(seed) {
    const hue = (seed * 47) % 360;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
        <defs>
          <linearGradient id="g${seed}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="hsl(${hue},28%,22%)"/>
            <stop offset="1" stop-color="hsl(${(hue + 40) % 360},35%,14%)"/>
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#g${seed})"/>
        <text x="50%" y="53%" font-family="Georgia,serif" font-size="30" fill="rgba(232,207,140,.85)"
              text-anchor="middle" dominant-baseline="middle">W &amp; C</text>
      </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  /* -----------------------------------------------------------------
     8. LIGHTBOX
     ----------------------------------------------------------------- */
  let lightboxIndex = 0;
  let lightboxPhotos = [];

  function openLightbox(photos, index) {
    const grid = $('#galleryGrid');
    lightboxPhotos = grid.__photos || photos;
    lightboxIndex = index;
    const lb = $('#lightbox');
    const img = $('#lightboxImg');
    img.src = lightboxPhotos[lightboxIndex];
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    const lb = $('#lightbox');
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
  }

  function navLightbox(dir) {
    if (!lightboxPhotos.length) return;
    lightboxIndex = (lightboxIndex + dir + lightboxPhotos.length) % lightboxPhotos.length;
    $('#lightboxImg').src = lightboxPhotos[lightboxIndex];
  }

  function initLightboxControls() {
    $('#lightboxClose')?.addEventListener('click', closeLightbox);
    $('#lightboxPrev')?.addEventListener('click', () => navLightbox(-1));
    $('#lightboxNext')?.addEventListener('click', () => navLightbox(1));
    $('#lightbox')?.addEventListener('click', (e) => {
      if (e.target.id === 'lightbox') closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      const lb = $('#lightbox');
      if (!lb || !lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navLightbox(-1);
      if (e.key === 'ArrowRight') navLightbox(1);
    });
  }

  /* -----------------------------------------------------------------
     9. TAMBAH KE KALENDER (Google Calendar link, tanpa dependency)
     ----------------------------------------------------------------- */
  function toGCalDate(iso) {
    return new Date(iso).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  function initAddToCalendar() {
    $$('.btn-add-cal').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.event;
        const ev = CONFIG.events[key];
        if (!ev) return;
        const url = new URL('https://calendar.google.com/calendar/render');
        url.searchParams.set('action', 'TEMPLATE');
        url.searchParams.set('text', ev.title);
        url.searchParams.set('dates', `${toGCalDate(ev.start)}/${toGCalDate(ev.end)}`);
        url.searchParams.set('location', ev.location);
        url.searchParams.set('details', `Undangan pernikahan ${CONFIG.coupleGroom} & ${CONFIG.coupleBride}`);
        window.open(url.toString(), '_blank', 'noopener');
      });
    });
  }

  /* -----------------------------------------------------------------
     10. RSVP + BUKU UCAPAN (localStorage sebagai mode demo offline,
         atau via API eksternal bila CONFIG.wishesApiUrl diisi)
     ----------------------------------------------------------------- */
  const STORAGE_KEY = 'undangan_wishes_v1';

  function loadWishes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  function saveWishesLocal(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderWishes(list) {
    const wrap = $('#wishesList');
    const countEl = $('#wishesCount');
    if (!wrap) return;
    countEl.textContent = list.length;

    if (!list.length) {
      wrap.innerHTML = '<p class="wishes-empty">Jadilah yang pertama mengirim ucapan &amp; doa 💛</p>';
      return;
    }

    wrap.innerHTML = list.slice().reverse().map((w) => `
      <div class="wish-card">
        <div class="wish-card__top">
          <span class="wish-card__name">${escapeHTML(w.name)}</span>
          <span class="wish-card__badge">${escapeHTML(w.attend)}</span>
        </div>
        <p class="wish-card__msg">${escapeHTML(w.message)}</p>
      </div>
    `).join('');
  }

  async function initRSVP() {
    const form = $('#rsvpForm');
    if (!form) return;
    const note = $('#rsvpNote');

    let wishes = loadWishes();

    // jika API tersedia, coba ambil data terbaru dari server
    if (CONFIG.wishesApiUrl) {
      try {
        const res = await fetch(CONFIG.wishesApiUrl);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) wishes = data;
        }
      } catch { /* tetap pakai data lokal bila gagal */ }
    }

    renderWishes(wishes);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = $('#rsvpName').value.trim();
      const message = $('#rsvpMessage').value.trim();
      const attend = form.querySelector('input[name="attend"]:checked')?.value || 'Hadir';

      if (!name || !message) {
        note.textContent = 'Mohon isi nama dan ucapan terlebih dahulu.';
        return;
      }

      const entry = { name, attend, message, ts: Date.now() };
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      note.textContent = 'Mengirim…';

      if (CONFIG.wishesApiUrl) {
        try {
          await fetch(CONFIG.wishesApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
          });
        } catch { /* tetap simpan lokal sebagai cadangan */ }
      }

      wishes.push(entry);
      saveWishesLocal(wishes);
      renderWishes(wishes);

      form.reset();
      form.querySelector('input[name="attend"][value="Hadir"]').checked = true;
      note.textContent = 'Terima kasih atas doa &amp; ucapannya 💛';
      submitBtn.disabled = false;
      showToast('Ucapan berhasil dikirim');

      setTimeout(() => { note.textContent = ''; }, 4000);
    });
  }

  /* -----------------------------------------------------------------
     11. HADIAH DIGITAL — toggle + salin nomor rekening
     ----------------------------------------------------------------- */
  function initGift() {
    const toggle = $('#giftToggle');
    const cards = $('#giftCards');
    if (toggle && cards) {
      toggle.addEventListener('click', () => {
        const willShow = cards.hidden;
        cards.hidden = !willShow;
        if (willShow) {
          cards.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
        }
      });
    }

    $$('.btn-copy').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const value = btn.dataset.copy;
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          const ta = document.createElement('textarea');
          ta.value = value;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        showToast('Nomor rekening disalin');
      });
    });
  }

  /* -----------------------------------------------------------------
     12. BAGIKAN UNDANGAN
     ----------------------------------------------------------------- */
  function initShare() {
    const btn = $('#shareBtn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const shareData = {
        title: `Undangan Pernikahan ${CONFIG.coupleGroom} & ${CONFIG.coupleBride}`,
        text: `Anda diundang ke pernikahan ${CONFIG.coupleGroom} & ${CONFIG.coupleBride}`,
        url: window.location.href,
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch {}
      } else {
        try {
          await navigator.clipboard.writeText(shareData.url);
          showToast('Tautan undangan disalin');
        } catch {
          showToast('Gagal menyalin tautan');
        }
      }
    });
  }

  /* -----------------------------------------------------------------
     13. TOAST
     ----------------------------------------------------------------- */
  let toastTimer = null;
  function showToast(msg) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-shown'), 2400);
  }

  /* -----------------------------------------------------------------
     14. TOMBOL KEMBALI KE ATAS
     ----------------------------------------------------------------- */
  function initToTop() {
    const btn = $('#toTop');
    if (!btn) return;
    btn.hidden = false;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        btn.classList.toggle('is-shown', window.scrollY > window.innerHeight * 0.8);
        ticking = false;
      });
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* -----------------------------------------------------------------
     15. TILT 3D — kartu mempelai & kartu hadiah bereaksi ke gerakan mouse
     ----------------------------------------------------------------- */
  function initTilt() {
    if (prefersReducedMotion) return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    $$('[data-tilt], .gift-card').forEach((card) => {
      let raf = null;
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = '';
      });
    });
  }

  /* -----------------------------------------------------------------
     16. PARTIKEL KELOPAK EMAS — canvas ringan, auto-adaptif performa
     ----------------------------------------------------------------- */
  function initPetals() {
    const canvas = $('#petalsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr;
    let particles = [];
    let running = true;
    let rafId = null;

    const isSmallScreen = () => window.innerWidth < 640;
    const countFor = () => (prefersReducedMotion ? 0 : isSmallScreen() ? 14 : 26);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeParticle() {
      return {
        x: Math.random() * w,
        y: Math.random() * -h,
        r: 4 + Math.random() * 5,
        speedY: 0.35 + Math.random() * 0.6,
        speedX: (Math.random() - 0.5) * 0.5,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        sway: Math.random() * Math.PI * 2,
        opacity: 0.35 + Math.random() * 0.4,
      };
    }

    function initParticles() {
      const n = countFor();
      particles = Array.from({ length: n }, makeParticle);
    }

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = '#d9b869';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.sway += 0.01;
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.sway) * 0.3;
        p.rot += p.rotSpeed;
        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }
        drawPetal(p);
      });
      rafId = requestAnimationFrame(tick);
    }

    resize();
    initParticles();
    tick();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); initParticles(); }, 200);
    });

    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) { tick(); } else if (rafId) { cancelAnimationFrame(rafId); }
    });
  }

  /* -----------------------------------------------------------------
     INIT — jalankan semua modul setelah DOM siap
     ----------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initGuestName();
    initEnvelope();
    initMusicToggle();
    initScrollReveal();
    initCountdown();
    initGallery();
    initLightboxControls();
    initAddToCalendar();
    initRSVP();
    initGift();
    initShare();
    initToTop();
    initTilt();
    initPetals();
  });
})();
