import { callApi } from "../apis/baseApi.js";




export async function danhSachViPham() {
    // Gắn CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/danhsachvipham.css";
    document.head.appendChild(link);


    const token = localStorage.getItem("token");
    // Gọi API để lấy dữ liệu
    const response = await callApi(`/api/v1/vipham`, 'GET', null, {
        Authorization: `Bearer ${token}`
    })
    console.log("check", response);
    // Tạo HTML dòng bảng
    const rows = response.result.map((v, index) => `
        <tr>
        <td>${index + 1}</td>
            <td>${v.nguoiViPham}</td>
            <td>${v.phong}</td>
            <td>${v.noiDung}</td>
            <td>${new Date(v.createAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>

            <td>${v.trangThai === "CHUAXULY" ? "Chưa xử lý" : "Đã xử lý"}</td>
        </tr>
    `).join("");

    // Trả về giao diện HTML
    return `
        <div class="vipham-container">
            <h2>Danh Sách Vi Phạm Nội Quy</h2>
            <table class="vipham-table">
                <thead>
                    <tr>
                    <th>STT</th>
                        <th>Người vi phạm</th>
                        <th>Phòng</th>
                        <th>Nội dung</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}
