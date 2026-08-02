let currentSlide = 0;
let slides = [];
let slideInterval = null;

function openInvitation() {
    // Sembunyikan cover depan
    document.getElementById('cover-screen').style.display = 'none';
    
    // Tampilkan container utama
    const mainContent = document.getElementById('main-content');
    mainContent.style.display = 'block';
    
    // Ambil semua elemen slide
    slides = document.querySelectorAll('.slide');
    
    if (slides.length > 0) {
        slides[0].classList.add('active');
        
        // Ganti slide secara otomatis setiap 15 detik (bisa diatur, di bawah 20 detik)
        slideInterval = setInterval(nextSlide, 15000);
    }
}

function nextSlide() {
    if (slides.length === 0) return;
    
    // Hilangkan kelas active dari slide saat ini
    slides[currentSlide].classList.remove('active');
    
    // Pindah ke slide berikutnya (jika habis, kembali ke slide 0)
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Tampilkan slide baru
    slides[currentSlide].classList.add('active');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Nomor rekening berhasil disalin!');
    }, function(err) {
        alert('Gagal menyalin rekening. Silakan coba lagi.');
        console.error('Error copying text: ', err);
    });
}
