// Fungsi untuk membuka undangan
function openInvitation() {
    // Menyembunyikan layar cover
    document.getElementById('cover-screen').style.display = 'none';
    
    // Menampilkan konten utama undangan
    document.getElementById('main-content').style.display = 'block';
    
    // Opsional: Memastikan scroll berada di paling atas saat undangan dibuka
    window.scrollTo(0, 0);
    
    // Jika nanti ada background music, kodenya bisa ditambahkan di dalam fungsi ini
    // contoh: document.getElementById('bg-music').play();
}

// Fungsi copy rekening untuk fitur Amplop Digital
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Nomor rekening berhasil disalin!');
    }, function(err) {
        alert('Gagal menyalin rekening. Silakan coba lagi.');
        console.error('Error copying text: ', err);
    });
}
