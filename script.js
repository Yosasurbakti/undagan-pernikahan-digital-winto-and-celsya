let currentSlide = 0;
let slides = document.querySelectorAll('.slide');

// Menargetkan area utama untuk mendeteksi usapan (swipe) atau klik
const container = document.querySelector('.card-container') || document.body;

function nextSlide() {
    // Sembunyikan slide saat ini
    slides[currentSlide].classList.remove('active');
    
    // Hitung index slide berikutnya
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Tampilkan slide berikutnya
    slides[currentSlide].classList.add('active');
}

function prevSlide() {
    // Sembunyikan slide saat ini
    slides[currentSlide].classList.remove('active');
    
    // Hitung index slide sebelumnya (mundur)
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    
    // Tampilkan slide sebelumnya
    slides[currentSlide].classList.add('active');
}

// ==========================================
// KONTROL GESER (SWIPE) UNTUK HP
// ==========================================
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleGesture();
}, { passive: true });

function handleGesture() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Pastikan pengguna menggeser ke samping, bukan scroll ke atas/bawah
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < -40) {
            // Geser ke Kiri -> Slide Berikutnya
            nextSlide();
        } else if (diffX > 40) {
            // Geser ke Kanan -> Slide Sebelumnya
            prevSlide();
        }
    }
}

// ==========================================
// KONTROL KLIK LAYAR UNTUK DESKTOP/HP
// ==========================================
container.addEventListener('click', (e) => {
    // Jangan ganti slide jika menekan tombol (contoh: tombol copy rekening) atau link
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button')) return;

    const containerRect = container.getBoundingClientRect();
    const clickX = e.clientX - containerRect.left;

    // Klik area kanan layar untuk maju, kiri untuk mundur
    if (clickX > containerRect.width / 2) {
        nextSlide();
    } else {
        prevSlide();
    }
});

// ==========================================
// FUNGSI COPY REKENING (TIDAK DIUBAH)
// ==========================================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Nomor rekening berhasil disalin!');
    });
}
