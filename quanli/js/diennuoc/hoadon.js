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

    <div class="filter-group">
  <label for="filterRoomId">Lọc theo phòng:</label>
  <select id="filterRoomId">
    <option value="">-- Tất cả phòng --</option>
  </select>
</div>

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

    let currentPage = 1;
    let currentRoomId = "";
    const pageSize = 5;

    function renderRoomFilterOptions() {
        callApi(`/api/v1/rooms`, 'GET', null, {
            "Authorization": `Bearer ${token}`
        }).then((data) => {
            if (data && data.result) {
                const select = document.getElementById("filterRoomId");
                select.innerHTML = `<option value="">-- Tất cả phòng --</option>`;
                data.result.forEach(room => {
                    const option = document.createElement("option");
                    option.value = room.id;
                    option.textContent = room.name;
                    select.appendChild(option);
                });
            }
        });
    }

    async function loadHoaDonList(page, pageSizeParam, roomId = "") {
        currentPage = page;
        currentRoomId = roomId;

        let url = `/api/v1/hoadon?page=${page}&size=${pageSizeParam}`;
        if (roomId) {
            url += `&filter=room.id:${roomId}`;
        }

        await callApi(url, 'GET', null, {
            "Authorization": `Bearer ${token}`
        }).then((data) => {
            const tbody = document.getElementById("invoiceList");
            tbody.innerHTML = '';

            data.result.forEach((item, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${(page - 1) * pageSizeParam + index + 1}</td>
                    <td>${item.room?.name || '---'}</td>
                    <td>${item.soDien}</td>
                    <td>${item.soNuoc}</td> 
                    <td>${item.tienDien.toLocaleString('vi-VN')}</td>
                    <td>${item.tienNuoc.toLocaleString('vi-VN')}</td>
                    <td>${item.tongTien.toLocaleString('vi-VN')}</td>
                    <td>${item.trangThai === "DADONG" ? "Đã thanh toán" : "Chưa thanh toán"}</td>
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
            renderInvoicePagination(data.meta.total, page, pageSizeParam);
        });
    }


    function bindSendInvoiceButtons() {
        document.querySelectorAll(".send-invoice-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                console.log(id);

                // ✅ Hiện thông báo ngay khi click
                showToast("Đang gửi hóa đơn...", "info");

                // Gửi API sau đó
                callApi(`/api/v1/email/${id}`, 'GET', null, {
                    "Authorization": `Bearer ${token}`
                })
                    .then(() => {
                        showToast("Hóa đơn đã được gửi!", "success");
                    })
                    .catch(() => {
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

                    // Reload lại danh sách với trang hiện tại
                    loadHoaDonList(currentPage, pageSize, currentRoomId);
                }).catch(() => {
                    showToast("Lỗi khi xóa hóa đơn", "error");
                });
            });
        });
    }



    function renderInvoicePagination(totalItems, current, pageSizeParam) {
        const paginationContainer = document.getElementById("invoice-pagination");
        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(totalItems / pageSizeParam);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            if (i === current) {
                btn.classList.add("active");
            }

            btn.addEventListener("click", () => {
                loadHoaDonList(i, pageSizeParam, currentRoomId);
            });

            paginationContainer.appendChild(btn);
        }
    }


    // Load list of invoices
    async function loadHoaDon() {
        renderRoomFilterOptions();

        document.getElementById("filterRoomId").addEventListener("change", function () {
            const selectedRoomId = this.value;
            loadHoaDonList(1, 5, selectedRoomId);
        });

        loadHoaDonList(1, 5); // Load first page
    }


    loadHoaDon();
}