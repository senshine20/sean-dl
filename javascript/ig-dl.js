import { createAPIUrl } from './api-config.js';  // Mengimpor fungsi dari api-config.js

// Fungsi untuk memvalidasi URL Instagram
const validateUrl = (url) => {
    const urlRegex = /[(http(s)?:\/\/)?(www\.)?instagram\.com\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
    return urlRegex.test(url); // Mengembalikan true jika URL valid
};

// Event listener untuk form submit
document.getElementById("download-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Mencegah form dari pengiriman default

    // Mengambil URL dari input
    const instagramUrl = document.getElementById("instagram-url").value;

    // Validasi URL yang dimasukkan
    if (!validateUrl(instagramUrl)) {
        document.getElementById("download-link").innerText = "URL Instagram tidak valid. Masukkan URL yang benar.";
        return;
    }

    // Membuat URL API untuk Instagram video downloader
    const apiUrl = createAPIUrl("vkrdownloader", "/server", { vkr: instagramUrl });

    // Mengirim permintaan ke API vkrdownloader
    fetch(apiUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        }
    })
    .then(response => response.json()) // Mengubah respons ke format JSON
    .then(data => {
        const downloadData = data.data.downloads; // Mengambil data download
        const downloadUrl = downloadData[0]?.url; // Ambil URL unduhan pertama

        if (downloadUrl) {
            // Jika ada URL unduhan, tampilkan link download di HTML
            document.getElementById("download-link").innerHTML = `
                <p><strong>Pilih Unduhan:</strong></p>
                <a href="${downloadUrl}" download>Download Video (${downloadData[0]?.size})</a>
            `;
        } else {
            document.getElementById("download-link").innerText = "Tidak ada media yang ditemukan untuk diunduh.";
        }
    })
    .catch(error => {
        console.error("Error:", error); // Logging kesalahan ke console
        document.getElementById("download-link").innerText = "Terjadi kesalahan. Coba lagi.";
    });
});
