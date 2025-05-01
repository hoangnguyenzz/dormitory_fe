
const API_URL = 'https://dormitory-domitory1.up.railway.app';
// const API_URL = 'http://localhost:8080';
export async function callApi(url, method = 'GET', data = null, headers = {}) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
    };

    // nếu có dữ liệu và phương thức không phải là GET, thêm dữ liệu vào body
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(API_URL + url, options);
        console.log("response", response.status)

        const result = await response.json();
        if (response.status >= 400 && response.status < 600) {
            console.error('Error :', result);
            localStorage.setItem("toastMessage", result.message);
            return null;
        }
        return result;

    } catch (error) {
        console.error('Fetch error:', error);

    }
}
