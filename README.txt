================================================================
 UNDANGAN PERNIKAHAN DIGITAL — Winto & Chelsya
 Panduan Pemakaian
================================================================

Terima kasih! Ini adalah source code lengkap undangan pernikahan
digital Anda: index.html, style.css, script.js — murni HTML/CSS/JS
(vanilla), tanpa framework, jadi ringan dan bisa dibuka di HP,
laptop, maupun PC tanpa instalasi apa pun.

----------------------------------------------------------------
1. CARA MEMBUKA / MENCOBA
----------------------------------------------------------------
Cukup klik dua kali file "index.html", atau upload seluruh folder
ini ke hosting (lihat bagian 6). Semua fitur (musik, hitung mundur,
galeri, RSVP) langsung berfungsi begitu file di-hosting online.
Membuka langsung dari file (file://) di sebagian browser bisa
membatasi fitur audio/localStorage — untuk hasil terbaik selalu
uji lewat hosting/live server.

----------------------------------------------------------------
2. GANTI TEKS: NAMA, TANGGAL, ALAMAT, ORANG TUA
----------------------------------------------------------------
Semua teks ada di file index.html, tinggal cari & ganti:

- Nama mempelai   : cari "Winto" dan "Chelsya" (beberapa tempat)
- Nama orang tua  : cari teks dalam tanda kurung siku, contoh:
                    [Nama Ayah Winto], [Nama Ibu Winto], dst.
- Tanggal & jam    : cari bagian <section id="countdown-section">
                    ubah atribut data-target="2026-12-12T08:00:00+07:00"
                    (format: TAHUN-BULAN-TANGGALTJAM:MENIT:DETIK+07:00)
                    Lalu di <section id="events"> ubah juga teks
                    tanggal/jam Akad Nikah & Resepsi agar sesuai.
- Alamat & lokasi  : cari "Jl. Contoh Alamat No. 123" dan ganti
                    dengan alamat asli. Juga ganti link tombol
                    "Lihat Lokasi" (atribut href) dengan link
                    Google Maps lokasi asli Anda.

Tanggal & lokasi acara pada script.js (bagian CONFIG.events) JUGA
perlu disamakan — dipakai untuk tombol "Tambah ke Kalender".

----------------------------------------------------------------
3. GANTI FOTO
----------------------------------------------------------------
Masukkan foto Anda ke folder assets/images/ dengan nama file:

  assets/images/groom.jpg        -> foto mempelai pria (Winto)
  assets/images/bride.jpg        -> foto mempelai wanita (Chelsya)
  assets/images/gallery-1.jpg    -> foto galeri 1
  assets/images/gallery-2.jpg    -> foto galeri 2
  ... sampai gallery-8.jpg

Selama foto belum ada, halaman otomatis menampilkan bingkai
placeholder yang tetap terlihat rapi (monogram/gradasi emas) —
jadi undangan tetap aman ditampilkan meski foto belum diunggah.

Tips: gunakan foto rasio persegi (1:1) untuk hasil terbaik pada
bingkai bundar mempelai dan grid galeri. Kompres foto (misal lewat
squoosh.app atau tinypng.com) ke bawah 300 KB per foto supaya
loading tetap cepat & mulus.

Ingin jumlah foto galeri lebih/kurang dari 8? Ubah angka
"galleryCount: 8" di bagian atas script.js.

----------------------------------------------------------------
4. PASANG MUSIK LATAR
----------------------------------------------------------------
Masukkan file musik (format mp3, disarankan di bawah 4 MB) ke:

  assets/audio/music.mp3

Musik akan otomatis diputar begitu tamu menekan tombol
"Buka Undangan" (kebijakan browser mengharuskan interaksi user
dulu sebelum audio bisa diputar — ini sudah ditangani).

PENTING soal hak cipta: pastikan Anda memiliki izin/lisensi untuk
lagu yang dipakai (misal lagu bebas royalti dari YouTube Audio
Library, Pixabay Music, dsb), khususnya jika undangan dibagikan
secara publik.

----------------------------------------------------------------
5. GANTI NOMOR REKENING (AMPLOP DIGITAL)
----------------------------------------------------------------
Cari <section id="gift"> di index.html, ganti nama bank, nomor
rekening, dan nama pemilik rekening pada bagian .gift-card.

----------------------------------------------------------------
6. AGAR UCAPAN/RSVP TERSIMPAN PERMANEN (OPSIONAL)
----------------------------------------------------------------
Secara default, ucapan tamu tersimpan di browser tamu itu sendiri
(localStorage) — cukup untuk demo, tapi TIDAK saling terlihat
antar tamu berbeda perangkat. Agar semua ucapan tersimpan di satu
tempat dan bisa dilihat semua orang, sambungkan ke Google Sheets
lewat Google Apps Script (gratis):

  a. Buat Google Spreadsheet baru.
  b. Extensions > Apps Script, tempel kode sederhana untuk
     menerima POST (simpan ke sheet) dan GET (kirim balik data
     sebagai JSON array [{name, attend, message, ts}, ...]).
  c. Deploy sebagai Web App (akses: "Anyone").
  d. Salin URL Web App tsb, tempel ke variabel
     `wishesApiUrl` di bagian atas script.js.

Jika tidak diisi, fitur tetap berjalan normal dalam mode lokal
per-perangkat.

----------------------------------------------------------------
7. CARA DEPLOY / MENGHOSTING (GRATIS)
----------------------------------------------------------------
Pilih salah satu cara termudah berikut:

A. GitHub Pages
   1. Buat repository baru di GitHub, upload semua isi folder ini.
   2. Settings > Pages > pilih branch "main" > Save.
   3. Undangan online di: https://username.github.io/nama-repo/

B. Netlify (drag & drop, paling mudah)
   1. Buka app.netlify.com/drop
   2. Seret (drag) folder ini ke halaman tersebut.
   3. Netlify langsung memberi link undangan online.

C. Vercel — mirip Netlify, import folder lalu deploy.

----------------------------------------------------------------
8. LINK PERSONAL PER TAMU (OPSIONAL)
----------------------------------------------------------------
Anda bisa mengirim link berbeda untuk tiap tamu supaya nama tamu
otomatis muncul di halaman sampul, dengan menambahkan parameter
?to= di akhir URL, contoh:

  https://undangan-anda.com/?to=Bapak%20Ahmad%20Fauzi

Spasi bisa ditulis %20 atau tanda "+".

----------------------------------------------------------------
9. STRUKTUR FILE
----------------------------------------------------------------
undangan/
├── index.html          -> struktur & konten halaman
├── style.css            -> semua tampilan & animasi
├── script.js             -> semua interaktivitas
├── README.txt            -> panduan ini
└── assets/
    ├── images/           -> taruh foto Anda di sini
    └── audio/            -> taruh musik.mp3 di sini

----------------------------------------------------------------
10. PERFORMA & KOMPATIBILITAS
----------------------------------------------------------------
- Sudah diuji berjalan mulus di ukuran layar HP, tablet, hingga
  desktop (fully responsive, tanpa breakpoint yang patah).
- Animasi memakai transform/opacity (dipercepat GPU) supaya tetap
  mulus dan tidak patah-patah (tidak "lemot").
- Partikel kelopak emas otomatis berhenti saat tab browser tidak
  aktif, dan jumlah partikel otomatis dikurangi di layar kecil,
  supaya baterai & performa HP tetap terjaga.
- Menghormati pengaturan "Reduce Motion" di perangkat tamu
  (animasi otomatis disederhanakan untuk aksesibilitas).

Selamat mempersiapkan hari bahagia Winto & Chelsya! 🤍
