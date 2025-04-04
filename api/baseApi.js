
const API_URL = 'http://localhost:8080';

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
        const result = await response.json();

        return result;

    } catch (error) {
        console.error('Fetch error:', error);

    }
}
