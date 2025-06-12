import { callApi } from "../../../apis/baseApi.js";
import { showToast } from "../../../thongbao/thongbao.js";

export function viPhamTemplate() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/quanli/css/vipham.css";
    document.head.appendChild(link);

    return `
    <div class="vipham-container">
      <h2>Nhập Vi Phạm Mới</h2>
      <form id="viPhamForm">
        <div class="form-group">
          <label for="roomId">Phòng</label>
          <select id="roomId" required></select>
        </div>
        <div class="form-group">
          <label for="userId">Người vi phạm</label>
          <select id="userId" required></select>
        </div>
        <div class="form-group">
          <label for="moTa">Nội dung</label>
          <textarea id="moTa" required></textarea>
        </div>
        <div class="form-group">
          <button type="submit">Thêm Vi Phạm</button>
        </div>
      </form>

      <h3>Danh sách Vi Phạm</h3>
      <div class="filter-group">
        <label for="filterRoomId">Lọc theo phòng:</label>
        <select id="filterRoomId">
          <option value="">-- Tất cả phòng --</option>
        </select>
      </div>

      <table class="vipham-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Phòng</th>
            <th>Người vi phạm</th>
            <th>Nội dung</th>
            <th>Ngày ghi nhận</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody id="viPhamList"></tbody>
      </table>
      <div id="viPhamPagination" class="pagination"></div>
    </div>
  `;
}

export async function listViPham() {
    const token = localStorage.getItem("token");
    const rowsPerPage = 5;
    let currentPage = 1;
    let currentRoomId = "";
    let allUsers = [];

    function renderRoomOptions() {
        callApi(`/api/v1/rooms?page=0&size=50`, "GET", null, {
            Authorization: `Bearer ${token}`,
        }).then((data) => {
            const rooms = data.result;
            const select = document.getElementById("roomId");
            const filterSelect = document.getElementById("filterRoomId");

            select.innerHTML = "<option value=''>-- Chọn phòng --</option>";
            filterSelect.innerHTML = "<option value=''>-- Tất cả phòng --</option>";

            rooms.forEach((room) => {
                const option = new Option(room.name, room.id);
                select.add(option.cloneNode(true));
                filterSelect.add(option.cloneNode(true));
            });

            filterSelect.addEventListener("change", () => {
                currentRoomId = filterSelect.value;
                console.log("Selected room ID:", currentRoomId);
                loadViPhamList(currentPage, rowsPerPage, currentRoomId);
            });

            select.addEventListener("change", () => {
                const selectedRoomId = select.value;
                updateUserOptions(selectedRoomId);
            });
        });
    }

    function renderUserOptions() {
        callApi(`/api/v1/users?page=0&size=100`, "GET", null, {
            Authorization: `Bearer ${token}`,
        }).then((data) => {
            allUsers = data.result;
            updateUserOptions(document.getElementById("roomId").value);
        });
    }

    function updateUserOptions(roomId) {
        const userSelect = document.getElementById("userId");
        userSelect.innerHTML = "<option value=''>-- Chọn người vi phạm --</option>";
        const filteredUsers = allUsers.filter(
            (user) => user.room && String(user.room.id) === String(roomId)
        );

        filteredUsers.forEach((user) => {
            const option = new Option(user.name, user.name); // Dùng name làm value
            userSelect.add(option);
        });
    }

    document.getElementById("viPhamForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const roomSelect = document.getElementById("roomId");
        const userSelect = document.getElementById("userId");

        const payload = {
            phong: roomSelect.options[roomSelect.selectedIndex].text,
            nguoiViPham: userSelect.value,
            noiDung: document.getElementById("moTa").value,
        };

        callApi(`/api/v1/vipham`, "POST", payload, {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }).then(() => {
            showToast("Thêm vi phạm thành công!", "success");
            e.target.reset();
            loadViPhamList(currentPage, rowsPerPage, currentRoomId);
        });
    });

    function loadViPhamList(page, size, roomId = "") {
        let url = `/api/v1/vipham?page=${page}&size=${size}`;
        if (roomId) url += `&filter=phong:${roomId}`;

        callApi(url, "GET", null, {
            Authorization: `Bearer ${token}`,
        }).then((data) => {
            const tbody = document.getElementById("viPhamList");
            tbody.innerHTML = "";
            data.result.forEach((item, idx) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
            <td>${(page - 1) * size + idx + 1}</td> 
            <td>${item.phong || "---"}</td>
            <td>${item.nguoiViPham || "---"}</td>
            <td>${item.noiDung}</td>
            <td>${new Date(item.createAt).toLocaleDateString("vi-VN")}</td>
            <td>
                <select class="status-select" id="filterRoomId" data-id="${item.id}">
                    <option value="CHUAXULY" ${item.trangThai === "CHUAXULY" ? "selected" : ""}>Chưa xử lý</option>
                    <option value="DAXULY" ${item.trangThai === "DAXULY" ? "selected" : ""}>Đã xử lý</option>
                </select>
            </td>
            <td><button class="delete-btn" data-id="${item.id}">Xoá</button></td>
        `;
                tbody.appendChild(tr);
            });

            bindDeleteButtons();
            bindStatusChange();
            renderPagination(data.meta.total, page, size);
        });
    }

    function bindDeleteButtons() {
        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                callApi(`/api/v1/vipham/${id}`, "DELETE", null, {
                    Authorization: `Bearer ${token}`,
                }).then(() => {
                    showToast("Xoá thành công", "success");
                    loadViPhamList(currentPage, rowsPerPage, currentRoomId);
                });
            });
        });
    }

    function bindStatusChange() {
        document.querySelectorAll(".status-select").forEach((select) => {
            select.addEventListener("change", (e) => {
                const id = select.dataset.id;
                const status = e.target.value;

                const payload = { id: id, trangThai: status };
                callApi(`/api/v1/vipham`, "PUT", payload, {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }).then(() => {
                    showToast("Cập nhật trạng thái thành công", "success");
                    loadViPhamList(currentPage, rowsPerPage, currentRoomId);
                });
            });
        });
    }

    function renderPagination(totalItems, currentPage, pageSize) {
        const container = document.getElementById("viPhamPagination");
        container.innerHTML = "";
        const totalPages = Math.ceil(totalItems / pageSize);
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            if (i === currentPage) btn.classList.add("active");
            btn.addEventListener("click", () => {
                loadViPhamList(i, pageSize, currentRoomId);
            });
            container.appendChild(btn);
        }
    }

    // Khởi tạo
    renderRoomOptions();
    renderUserOptions();
    loadViPhamList(currentPage, rowsPerPage);
}
