import { callApi } from "../../../api/baseApi.js";
import { showToast } from "../../../thongbao/thongbao.js";

const token = localStorage.getItem("token");

export function hoaDon() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/quanli/css/hoadon.css";
    document.head.appendChild(link);

    return `
    <h2>Danh Sách Hóa Đơn</h2>
    <table class="invoice-table">
      <thead>
        <tr>
          <th>STT</th>
          <th>Phòng</th>
          <th>Số điện</th>
          <th>Số nước</th>
          <th>Tiền điện (VNĐ)</th>
          <th>Tiền nước (VNĐ)</th>
          <th>Tổng tiền (VNĐ)</th>
          <th>Trạng thái</th>
          <th>Ngày tạo</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody id="invoiceList">
        <!-- Dữ liệu sẽ được render bằng JavaScript -->
      </tbody>
    </table>
    <div class="pagination" id="invoice-pagination"></div>
  `;
}


export async function listHoaDon() {
    async function loadHoaDonList(page, pageSize) {


        await callApi(`/api/v1/hoadon?page=${page}&size=${pageSize}`, 'GET', null, {
            "Authorization": `Bearer ${token}`
        }).then((data) => {
            const tbody = document.getElementById("invoiceList");
            tbody.innerHTML = '';

            data.result.forEach((item, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
        <td>${(page - 1) * pageSize + index + 1}</td>
        <td>${item.room?.name || '---'}</td>
        <td>${item.soDien}</td>
        <td>${item.soNuoc}</td>
        <td>${item.tienDien}</td>
        <td>${item.tienNuoc}</td>
        <td>${(item.soDienCuoi - item.soDienDau) * item.donGiaDien + (item.soNuocCuoi - item.soNuocDau) * item.donGiaNuoc}</td>
        <td>${item.status || 'Chưa thanh toán'}</td>
        <td>${new Date(item.createAt).toLocaleDateString('vi-VN')}</td>
        <td>
          <button class="send-invoice-btn" data-id="${item.id}" data-item='${JSON.stringify(item)}'>Gửi hóa đơn</button>
          <button class="delete-btn" data-id="${item.id}">Xóa</button>
        </td>
      `;
                tbody.appendChild(tr);
            });

            bindSendInvoiceButtons();
            bindDeleteButtons();
            renderInvoicePagination(data.meta.total, page, pageSize);
        });
    }

    function bindSendInvoiceButtons() {
        document.querySelectorAll(".send-invoice-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                callApi(`/api/v1/hoadon/${id}/send`, 'POST', null, {
                    "Authorization": `Bearer ${token}`
                }).then(() => {
                    showToast("Hóa đơn đã được gửi!", "success");
                }).catch(() => {
                    showToast("Lỗi khi gửi hóa đơn", "error");
                });
            });
        });
    }

    function bindDeleteButtons() {
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                callApi(`/api/v1/hoadon/${id}`, 'DELETE', null, {
                    "Authorization": `Bearer ${token}`
                }).then(() => {
                    showToast("Đã xóa hóa đơn!", "success");
                    loadHoaDonList(1, 5); // Reload after deletion
                }).catch(() => {
                    showToast("Lỗi khi xóa hóa đơn", "error");
                });
            });
        });
    }

    function renderInvoicePagination(totalItems, current, pageSize) {
        const paginationContainer = document.getElementById("invoice-pagination");
        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(totalItems / pageSize);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            if (i === current) {
                btn.classList.add("active");
            }

            btn.addEventListener("click", () => {
                loadHoaDonList(i, pageSize);
            });

            paginationContainer.appendChild(btn);
        }
    }

    // Load list of invoices
    async function loadHoaDon() {
        loadHoaDonList(1, 5); // Load first page with 5 items per page
    }

    loadHoaDon();
}