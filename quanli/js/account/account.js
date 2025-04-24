import { showToast } from "../../../thongbao/thongbao.js";


// accountManagementPage.js
import { callApi } from "../../../apis/baseApi.js";

export function listAccountPage() {


    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/quanli/css/account.css";
    document.head.appendChild(link);
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
            <th>Phòng</th>
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
         
          <select id="account-role" name="role">
            <option value="ADMIN">Admin</option>
            <option value="MANAGE">Quản lý</option>
            <option value="USER">Sinh viên</option>
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
            <td>${(currentPage - 1) * rowsPerPage + index + 1}</td>
            <td>${account.name}</td>
            <td><img src="${account.avatar}" alt="Avatar" width="40" height="40"></td>
            <td>${account.email}</td>
            <td>${account.phone || ''}</td>
            <td>${(account.gender === 'MALE' ? 'Nam' : 'Nữ') || ''}</td>
            <td>${account.role.name === "ADMIN" ? "Admin" : account.role.name === "MANAGE" ? "Quản lý" : "Sinh viên"}</td>
            <td>${account.room ? account.room.name : 'Chưa có'}</td>
            <td>${new Date(account.createAt).toLocaleDateString("vi-VN")}</td>
            <td>
              <button class="edit-btn" data-id="${account.id}" data-account='${JSON.stringify(account)}'>Đổi quyền</button>
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
                    console.log("checked :", account)
                    openEditSidebar(account);
                });
            });
        }

        function openEditSidebar(account) {
            const sidebar = document.getElementById("edit-room-sidebar");

            document.getElementById("account-role").value = account.role.name;

            sidebar.classList.add("active");

            const form = document.getElementById("edit-room-form");
            form.onsubmit = async (e) => {
                e.preventDefault();

                const updatedAccount = {
                    id: account.id,
                    role: { name: form.role.value }
                };
                const data = callApi(`/api/v1/users`, 'PUT', updatedAccount, {
                    "Authorization": `Bearer ${token}`
                }).then((data) => {

                    if (data) {
                        console.log(" data ", data)
                        showToast("Cập nhật thành công!", "success");
                        loadAccounts();

                    } else {
                        const message = localStorage.getItem("toastMessage");
                        if (message) {
                            showToast(message, "error");
                            localStorage.removeItem("toastMessage");
                        }
                    }
                });

            };
        }

        function bindDeleteButtons() {
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const id = btn.dataset.id;
                    if (confirm("Bạn có chắc muốn xóa tài khoản này không?")) {
                        const data = callApi(`/api/v1/users/${id}`, 'DELETE', null, {
                            "Authorization": `Bearer ${token}`
                        }).then((data) => {
                            console.log(" data kk ", data)
                            try {
                                console.log(" data ", data)
                                showToast("Cập nhật thành công!", "success");
                                loadAccounts();

                            } catch (err) {
                                const message = localStorage.getItem("toastMessage");
                                if (message) {
                                    showToast(message, "error");
                                    localStorage.removeItem("toastMessage");
                                }
                            }
                        });
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
