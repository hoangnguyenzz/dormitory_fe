import { callApi } from "../api/baseApi.js";







export async function chiTietPhong(data) {
    const token = localStorage.getItem("token");

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/chitietphong.css";
    document.head.appendChild(link);

    const hashValue = window.location.hash.substring(1);

    const data1 = await callApi(`/api/v1/users/byroom/${data.id}`, 'GET', null);
    console.log("data 1:", data1.data.length);

    if (!data) {
        return `<p>Không tìm thấy dữ liệu phòng ${hashValue}</p>`;
    }

    const listSV = data1.data.map(sv => `
        <tr>
            <td>${sv.name}</td>
            <td>${sv.student.maSv}</td>
            <td>${sv.student.lop}</td>
            <td>${sv.student.chuyenNganh}</td>
        </tr>
    `).join("");

    return `
        <div class="room-detail-container">
            <h2>🔍 Chi tiết phòng: ${hashValue}</h2>
             <button id="btn-dang-ky" class="btn-dang-ky"> Đăng ký phòng</button>
               <div id="successMessage" class="success-message">
                   🎉 Đăng ký phòng thành công!
                    </div>
            <div class="room-info-grid">
                <div class="info-box">
                    <h3>📌 Thông tin chung</h3>
                    <p><strong>Loại phòng:</strong> ${data.capacity} Người</p>
                    <p><strong>Tầng:</strong> 1</p>
                    <p><strong>Trạng thái:</strong> ${data.available === true ? "Đang hoạt động" : "Không hoạt động"}</p>
                    <p><strong>Số người:</strong> ${data1.data.length} / ${data.capacity}</p>
                    <p><strong>Giá phòng:</strong> ${data.price}</p>
                </div>

                <div class="info-box">
                    <h3>🛠️ Thiết bị</h3>
                    <ul>
                        <li><b>Giường:</b> 4</li>
                        <li><b>Bàn học</b> 4</li>
                        <li><b>Tủ đồ</b> 2</li>
                        <li><b>Quạt trần</b> 1</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h3>⚡ Điện & Nước</h3>
                    <p><strong>Điện:</strong> 3.000vnđ/1 kWh</p>
                    <p><strong>Nước:</strong> 8.000vnđ/1 m³</p>
                </div>
            </div>

            <div class="resident-list">
                <h3>🧑‍🎓 Danh sách sinh viên</h3>
                ${(data1.data.length) > 0 ? `
                    <table>
                        <thead>
                            <tr>
                                <th>Họ tên</th>
                                <th>MSSV</th>
                                <th>Lớp</th>
                                <th>Ngành</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${listSV}
                        </tbody>
                    </table>` : "<p>Phòng hiện không có sinh viên.</p>"
        }
            </div>
            
        </div>
       
    `;
}






