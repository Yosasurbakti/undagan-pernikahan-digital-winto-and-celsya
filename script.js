// --- FUNGSI ANIMASI SCROLL ---
// Menggunakan Intersection Observer untuk mendeteksi kapan elemen terlihat di layar
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Animasi terpicu ketika 15% elemen sudah muncul di layar
};

const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // Jika elemen terlihat di layar
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Opsional: unobserve agar animasi hanya terjadi satu kali saat pertama kali di-scroll
            // observer.unobserve(entry.target); 
        } else {
            // Hapus komentar pada baris di bawah ini jika kamu ingin 
            // animasinya terjadi berkali-kali setiap di-scroll naik/turun
            // entry.target.classList.remove('visible'); 
        }
    });
}, observerOptions);

// Fungsi untuk mengaktifkan pemantauan pada semua elemen yang memiliki class 'animate-on-scroll'
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => scrollObserver.observe(el));
}


// --- FUNGSI UNDANGAN ---
function openInvitation() {
    // Menyembunyikan layar cover
    document.getElementById('cover-screen').style.display = 'none';
    
    // Menampilkan konten utama undangan
    document.getElementById('main-content').style.display = 'block';
    
    // Memastikan scroll berada di paling atas saat undangan dibuka
    window.scrollTo(0, 0);
    
    // Menjalankan fungsi animasi setelah cover dihilangkan
    // Diberi jeda 100ms agar elemen HTML sempat dirender oleh browser
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Nomor rekening berhasil disalin!');
    }, function(err) {
        alert('Gagal menyalin rekening. Silakan coba lagi.');
        console.error('Error copying text: ', err);
    });
}
