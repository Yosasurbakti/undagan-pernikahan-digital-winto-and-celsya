let currentSlide = 0;
let slides = document.querySelectorAll('.slide');

// Jalankan otomatis setiap 15 detik (di bawah 20 detik sesuai permintaan)
if (slides.length > 0) {
    setInterval(nextSlide, 5000); 
}

function nextSlide() {
    // Sembunyikan slide saat ini
    slides[currentSlide].classList.remove('active');
    
    // Hitung index slide berikutnya
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Tampilkan slide berikutnya
    slides[currentSlide].classList.add('active');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Nomor rekening berhasil disalin!');
    });
}
