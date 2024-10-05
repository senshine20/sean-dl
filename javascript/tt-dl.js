import { createAPIUrl } from './api-config.js';  // Mengimpor fungsi dari api-config.js

// Fungsi untuk memvalidasi URL TikTok
const validateUrl = (url) => {
    const urlRegex = /[(http(s)?:\/\/)?(www\.)?tiktok\.com\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
    return urlRegex.test(url); // Mengembalikan true jika URL valid
};

// Event listener untuk form submit
document.getElementById("download-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Mencegah form dari pengiriman default

    // Mengambil URL dari input
    const tiktokUrl = document.getElementById("tiktok-url").value;

    // Validasi URL yang dimasukkan
    if (!validateUrl(tiktokUrl)) {
        document.getElementById("download-link").innerText = "URL TikTok tidak valid. Masukkan URL yang benar.";
        return;
    }

    // Membuat URL API untuk TikTok video downloader
    const apiUrl = createAPIUrl("vkrdownloader", "/server", { vkr: tiktokUrl });

    // Mengirim permintaan ke API vkrdownloader
    fetch(apiUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        }
    })
    .then(response => response.json()) // Mengubah respons ke format JSON
    .then(data => {
        const downloadData = data.data.downloads; // Mengambil data download

        // Konstanta untuk link tanpa watermark dan dengan watermark
        const downloadUrlNoWatermark = downloadData.find(d => d.format_id === "no_watermark");
        const downloadUrlWatermark = downloadData.find(d => d.format_id === "watermark");

        // Membuat HTML untuk link unduhan
        let downloadLinksHtml = `<p><strong>Pilih Unduhan:</strong></p>`;

        // Membuat link unduhan untuk tanpa watermark
        if (downloadUrlNoWatermark) {
            downloadLinksHtml += `
                <a href="${downloadUrlNoWatermark.url}" download="tiktok_video_no_watermark.mp4" class="btn btn-primary">
                    Download Video No Watermark (${downloadUrlNoWatermark.size})
                </a><br>
            `;
        }

        // Membuat link unduhan untuk dengan watermark
        if (downloadUrlWatermark) {
            downloadLinksHtml += `
                <a href="${downloadUrlWatermark.url}" download="tiktok_video_watermark.mp4" class="btn btn-secondary">
                    Download Video Watermark (${downloadUrlWatermark.size})
                </a><br>
            `;
        }

        // Menampilkan hasil atau pesan jika tidak ada media ditemukan
        document.getElementById("download-link").innerHTML = 
            downloadLinksHtml === `<p><strong>Pilih Unduhan:</strong></p>` 
                ? "Tidak ada media yang ditemukan untuk diunduh."
                : downloadLinksHtml;
    })
    .catch(error => {
        console.error("Error:", error); // Logging kesalahan ke console
        document.getElementById("download-link").innerText = "Terjadi kesalahan. Coba lagi.";
    });
});
