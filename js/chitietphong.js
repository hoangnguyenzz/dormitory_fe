import { callApi } from "../apis/baseApi.js";
import { showToast } from "../thongbao/thongbao.js";


export async function chiTietPhong(data) {
    const token = localStorage.getItem("token");

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/chitietphong.css";
    document.head.appendChild(link);

    const hashValue = window.location.hash.substring(1);
    const data1 = await callApi(`/api/v1/users/byroom/${data.id}`, 'GET', null);

    if (!data) {
        return `<p>Không tìm thấy dữ liệu phòng ${hashValue}</p>`;
    }

    const listSV = data1.data.map(sv => {
        const gender = sv.gender === 'MALE' ? 'Nam' : sv.gender === 'FEMALE' ? 'Nữ' : 'Khác';
        const dob = new Date(sv.ngaySinh).toLocaleDateString("vi-VN");

        if (data.doiTuong === 'STUDENT') {
            return `
                <tr>
                    <td>${sv.name}</td>
                    <td>${gender}</td>
                    <td>${dob}</td>
                    <td>${sv.student.maSv}</td>
                    <td>${sv.student.lop}</td>
                    <td>${sv.student.chuyenNganh}</td>
                </tr>
            `;
        } else {
            return `
                <tr>
                    <td>${sv.name}</td>
                    <td>${gender}</td>
                    <td>${dob}</td>
                    <td colspan="3">${sv.nguoidilam.congViec || "Không rõ"}</td>
                </tr>
            `;
        }
    }).join("");

    // const hasSinhVien = data1.data.some(sv => sv.doiTuong === 'SINHVIEN');

    let buttonHTML = '';
    if (data1.data.length < data.capacity && data.trangThai !== 'KHONGHOATDONG') {
        buttonHTML = `<button id="btn-dang-ky" class="btn-dang-ky"> Đăng ký phòng</button>`;
    }

    return `
        <div class="room-detail-container">
            <h2>🔍 Chi tiết phòng: ${hashValue}</h2>
            ${buttonHTML}

            <div class="room-info-grid">
                <div class="info-box">
                    <h3>📌 Thông tin chung</h3>
                    <p><strong>Loại phòng:</strong> ${data.capacity} Người</p>
                    <p><strong>Tầng:</strong> 1</p>
                    <p><strong>Trạng thái:</strong> ${data.trangThai === 'DANGHOATDONG' ? "Đang hoạt động" : data.trangThai === 'TRONG' ? 'Trống' : "Không hoạt động"}</p>
                    <p><strong>Số người:</strong> ${data1.data.length} / ${data.capacity}</p>
                    <p><strong>Giá phòng:</strong> ${new Intl.NumberFormat('vi-VN').format(data.price)} đ</p>
                </div>

                <div class="info-box">
                    <h3>🛠️ Thiết bị</h3>
                    <ul>
                        <li><b>Giường:</b> 4</li>
                        <li><b>Bàn học:</b> 4</li>
                        <li><b>Tủ đồ:</b> 2</li>
                        <li><b>Quạt trần:</b> 1</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h3>⚡Chi phí </h3>
                    <p><strong>Điện:</strong> 3.000vnđ/1 kWh</p>
                    <p><strong>Nước:</strong> 8.000vnđ/1 m³</p>
                    <p><strong>Rác:</strong> 30.000vnđ/1 tháng</p>
                </div>
            </div>

            <div class="resident-list">
                <h3>🧑‍🎓 Danh sách thành viên</h3>
                ${data1.data.length > 0
            ? `<table>
                        <thead>
                            <tr>
                                <th>Họ tên</th>
                                <th>Giới tính</th>
                                <th>Ngày Sinh</th>
                                <th>${data.doiTuong === 'STUDENT' ? 'MSSV' : 'Công việc'}</th>
                                ${data.doiTuong === 'STUDENT'
                ? `<th>Lớp</th><th>Ngành</th>`
                : `<th colspan="2"></th>`}
                            </tr>
                        </thead>
                        <tbody>
                            ${listSV}
                        </tbody>
                    </table>`
            : "<p>Phòng hiện không có thành viên.</p>"
        }
            </div>
        </div>
    `;
}



export function handleDangKyPhong(room) {
    // Gắn sự kiện cho nút đăng ký (nếu có)
    const btnDangKy = document.getElementById("btn-dang-ky");
    if (btnDangKy) {
        btnDangKy.addEventListener("click", async () => {
            const token = localStorage.getItem("token");
            console.log("room", room)
            if (!token) {
                showToast("Vui lòng đăng nhập", "info");
                return;
            }

            const confirmResult = confirm("Bạn có thật sự muốn đăng ký phòng này?");
            if (confirmResult) {

                try {
                    showToast("Đang xử lí...", "info");
                    await callApi(`/api/v1/email/dangkiphong/${room.id}`, "GET", null, { "Authorization": `Bearer ${token}` })


                    showToast("✅ Đăng ký đã được gửi! Vui lòng kiểm tra email của bạn để xác nhận.", "success");


                } catch (error) {
                    console.error(error);
                    showToast("❌ Đăng ký thất bại. Vui lòng thử lại.");
                }
            }
        });
    }
}





