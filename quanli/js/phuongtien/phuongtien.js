
import { callApi } from "../../../api/baseApi.js";
import { showToast } from "../../../thongbao/thongbao.js";

const token = localStorage.getItem("token");



export function danhSachXe() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/quanli/css/phuongtien.css";
    document.head.appendChild(link);

    return `
    <h2>Danh Sách Xe</h2>
    <div class="table-responsive">
      <table class="xe-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Thẻ xe</th>
            <th>Chủ xe</th>
            <th>Biển số xe</th>
            <th>Loại xe</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="xeList">
          <!-- Dữ liệu sẽ được render bằng JavaScript -->
        </tbody>
      </table>
    </div>
    <div class="pagination" id="xe-pagination"></div>
  `;
}


export async function listXe() {
    async function loadXeList(page, pageSize) {
        await callApi(`/api/v1/vehicles?page=${page}&size=${pageSize}`, 'GET', null, {
            "Authorization": `Bearer ${token}`
        }).then((data) => {
            const tbody = document.getElementById("xeList");
            tbody.innerHTML = "";

            data.result.forEach((item, index) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
          <td>${(page - 1) * pageSize + index + 1}</td>
          <td>${item.ticket}</td>
          <td>${item.user.name}</td>
          <td>${item.licensePlate}</td>
          <td>${item.type}</td>
          <td>
            <button class="delete-btn" data-id="${item.id}">Xóa</button>
          </td>
        `;
                tbody.appendChild(tr);
            });

            bindDeleteXeButtons();
            renderXePagination(data.meta.total, page, pageSize);
        });
    }

    function bindDeleteXeButtons() {
        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;

                callApi(`/api/v1/vehicles/${id}`, 'DELETE', null, {
                    "Authorization": `Bearer ${token}`
                }).then(() => {
                    showToast("Đã xóa xe!", "success");
                    loadXeList(1, 5);
                }).catch(() => {
                    showToast("Lỗi khi xóa xe", "error");
                });

            });
        });
    }

    function renderXePagination(totalItems, current, pageSize) {
        const paginationContainer = document.getElementById("xe-pagination");
        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(totalItems / pageSize);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            if (i === current) {
                btn.classList.add("active");
            }

            btn.addEventListener("click", () => {
                loadXeList(i, pageSize);
            });

            paginationContainer.appendChild(btn);
        }
    }

    // Load danh sách xe trang đầu tiên
    function loadXe() {
        loadXeList(1, 5);
    }

    loadXe();
}
