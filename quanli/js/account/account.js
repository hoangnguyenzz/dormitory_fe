// accountManagementPage.js
import { callApi } from "../../../api/baseApi.js";

export function listAccountPage() {
    return `
    <div class="table-container">
      <h1>Danh sách tài khoản</h1>
      <table id="account-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Avatar</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Giới tính</th>
            <th>Quyền</th>
            <th>Thời gian tạo</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="account-table-body">
          <!-- Dữ liệu sẽ được render bằng JS -->
        </tbody>
      </table>
    </div>
    <div class="pagination" id="account-pagination"></div>

    <!-- Sửa tài khoản -->
    <div class="edit-room-sidebar" id="edit-room-sidebar">
      <div class="edit-room-content">
        <span class="close-btn" id="close-edit-room">&times;</span>
        <h2>Sửa tài khoản</h2>
        <form id="edit-room-form">
          <label for="account-name">Tên:</label>
          <input type="text" id="account-name" name="name" required>

          <label for="account-avatar">Avatar URL:</label>
          <input type="text" id="account-avatar" name="avatar">

          <label for="account-email">Email:</label>
          <input type="email" id="account-email" name="email" required>

          <label for="account-phone">Số điện thoại:</label>
          <input type="text" id="account-phone" name="phone">

          <label for="account-gender">Giới tính:</label>
          <select id="account-gender" name="gender">
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </select>

          <button type="submit">Lưu thay đổi</button>
        </form>
      </div>
    </div>
  `;
}

export async function listAccountPageTest() {
    const token = localStorage.getItem("token");
    const accountTable = document.getElementById("account-table");

    if (accountTable) {
        console.log("Account table found!");
        const rowsPerPage = 5;
        let currentPage = 1;

        async function fetchAccounts(page, size) {
            try {
                const data = await callApi(`/api/v1/users?page=${page}&size=${size}`, 'GET', null, {
                    "Authorization": `Bearer ${token}`
                });
                return data;
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
                return null;
            }
        }

        function renderAccountTable(accounts) {
            const tbody = document.getElementById("account-table-body");
            tbody.innerHTML = "";

            accounts.forEach((account, index) => {
                const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${account.name}</td>
            <td><img src="${account.avatar}" alt="Avatar" width="40" height="40"></td>
            <td>${account.email}</td>
            <td>${account.phone || ''}</td>
            <td>${account.gender || ''}</td>
            <td>${account.role || ''}</td>
            <td>${new Date(account.createAt).toLocaleDateString("vi-VN")}</td>
            <td>
              <button class="edit-btn" data-id="${account.id}" data-account='${JSON.stringify(account)}'>Sửa</button>
              <button class="delete-btn" data-id="${account.id}">Xoá</button>
            </td>
          </tr>
        `;
                tbody.innerHTML += row;
            });
        }

        function renderPagination(pageCount) {
            const paginationContainer = document.getElementById("account-pagination");
            paginationContainer.innerHTML = "";

            for (let i = 1; i <= pageCount; i++) {
                const button = document.createElement("button");
                button.textContent = i;
                if (i === currentPage) {
                    button.classList.add("active");
                }
                button.addEventListener("click", () => {
                    currentPage = i;
                    loadAccounts();
                });
                paginationContainer.appendChild(button);
            }
        }

        function bindEditButtons() {
            document.querySelectorAll(".edit-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const account = JSON.parse(btn.dataset.account);
                    openEditSidebar(account);
                });
            });
        }

        function openEditSidebar(account) {
            const sidebar = document.getElementById("edit-room-sidebar");

            document.getElementById("account-name").value = account.name || "";
            document.getElementById("account-avatar").value = account.avatar || "";
            document.getElementById("account-email").value = account.email || "";
            document.getElementById("account-phone").value = account.phone || "";
            document.getElementById("account-gender").value = account.gender || "OTHER";

            sidebar.classList.add("active");

            const form = document.getElementById("edit-room-form");
            form.onsubmit = async (e) => {
                e.preventDefault();

                const updatedAccount = {
                    id: account.id,
                    name: form.name.value,
                    avatar: form.avatar.value,
                    email: form.email.value,
                    phone: form.phone.value,
                    gender: form.gender.value
                };

                try {
                    await callApi(`/api/v1/accounts`, 'PUT', updatedAccount, {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    });
                    showToast("Cập nhật thành công!", "success");
                    sidebar.classList.remove("active");
                    loadAccounts();
                } catch (err) {
                    console.error("Cập nhật lỗi", err);
                    showToast("Cập nhật thất bại!", "error");
                }
            };
        }

        function bindDeleteButtons() {
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const id = btn.dataset.id;
                    try {
                        await callApi(`/api/v1/accounts/${id}`, 'DELETE', null, {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        });
                        showToast("Xoá thành công!", "success");
                        loadAccounts();
                    } catch (err) {
                        console.error("Xoá lỗi", err);
                        showToast("Xoá thất bại!", "error");
                    }
                });
            });
        }

        document.getElementById("close-edit-room").addEventListener("click", () => {
            document.getElementById("edit-room-sidebar").classList.remove("active");
        });

        async function loadAccounts() {
            const data = await fetchAccounts(currentPage, rowsPerPage);
            if (data) {
                renderAccountTable(data.result);
                bindEditButtons();
                bindDeleteButtons();
                renderPagination(Math.ceil(data.meta.total / rowsPerPage));
            }
        }

        loadAccounts();
    }
}
