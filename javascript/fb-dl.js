import { createAPIUrl } from './api-config.js';  // Mengimpor fungsi dari api-config.js

// Fungsi untuk memvalidasi URL Facebook
const validateUrl = (url) => {
    const urlRegex = /[(http(s)?:\/\/)?(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
    return urlRegex.test(url); // Mengembalikan true jika URL valid
};

// Event listener untuk form submit
document.getElementById("download-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Mencegah form dari pengiriman default

    // Mengambil URL dari input
    const facebookUrl = document.getElementById("facebook-url").value;

    // Validasi URL yang dimasukkan
    if (!validateUrl(facebookUrl)) {
        document.getElementById("download-link").innerText = "URL tidak valid. Masukkan URL yang benar.";
        return;
    }

    // Membuat URL API untuk Facebook video downloader
    const apiUrl = createAPIUrl("vkrdownloader", "/server", { vkr: facebookUrl });

    // Mengirim permintaan ke API vkrdownloader
    fetch(apiUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        }
    })
    .then(response => response.json()) // Mengubah respons ke format JSON
    .then(data => {
        const downloadData = data.data.downloads; // Mengambil data download
        let downloadLinksHtml = `<p><strong>Pilih Resolusi:</strong></p>`; // Awal HTML untuk tampilan link

        // Konstanta untuk link HD dan SD
        const downloadUrlHD = downloadData.find(d => d.format_id === "hd");
        const downloadUrlSD = downloadData.find(d => d.format_id === "sd");

        // Membuat link unduhan untuk HD
        if (downloadUrlHD) {
            downloadLinksHtml += `
                <a href="${downloadUrlHD.url}" download="video_hd.mp4" class="btn btn-primary">
                    Download Video HD (${downloadUrlHD.size})
                </a><br>
            `;
        }

        // Membuat link unduhan untuk SD
        if (downloadUrlSD) {
            downloadLinksHtml += `
                <a href="${downloadUrlSD.url}" download="video_sd.mp4" class="btn btn-secondary">
                    Download Video SD (${downloadUrlSD.size})
                </a><br>
            `;
        }

        // Menampilkan hasil atau pesan jika tidak ada video ditemukan
        document.getElementById("download-link").innerHTML = 
            downloadLinksHtml === `<p><strong>Pilih Resolusi:</strong></p>` 
                ? "Tidak ada video yang ditemukan untuk diunduh."
                : downloadLinksHtml;
    })
    .catch(error => {
        console.error("Error:", error); // Logging kesalahan ke console
        document.getElementById("download-link").innerText = "Terjadi kesalahan. Coba lagi.";
    });
});
