// Daftar API yang tersedia
const APIs = {
    vkrdownloader: {
        baseURL: "https://vkrdownloader.vercel.app"
    }
};

// Fungsi untuk membuat URL berdasarkan API yang dipilih dan endpoint
export const createAPIUrl = (apiName, endpoint, params = {}) => {
    const api = APIs[apiName];
    if (!api) {
        throw new Error(`API ${apiName} tidak ditemukan.`);
    }

    // Generate URL dari API baseURL dan endpoint
    const queryParams = new URLSearchParams(params);
    const apiUrl = new URL(endpoint, api.baseURL);
    apiUrl.search = queryParams.toString();
    
    return apiUrl.toString();
};

// Fungsi untuk melihat daftar API
export const listAPIUrl = () => {
    return APIs;
};
