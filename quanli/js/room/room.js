import { callApi } from "../../../api/baseApi.js";
import { showToast } from "../../../thongbao/thongbao.js";

export function listRoomPage() {
    return `
    <div class="table-container">
        <table id="room-table">
        <h1>Danh sách phòng</h1>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Tên phòng</th>
                    <th>Số người ở</th>
                    <th>Trạng thái</th>
                    <th>Thời gian tạo</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="room-table-body">
                <!-- Dữ liệu sẽ được render bằng JS -->
            </tbody>
        </table>
    </div>
    <div class="pagination" id="room-pagination"></div>


    <!-- Sửa phòng -->
    <div class="edit-room-sidebar" id="edit-room-sidebar">
    <div class="edit-room-content">
        <span class="close-btn" id="close-edit-room">&times;</span>
        <h2>Sửa phòng</h2>
        <form id="edit-room-form">
            <label for="room-name">Tên phòng:</label>
            <input type="text" id="room-name" name="name" required>

            <label for="room-capacity">Số người ở:</label>
            <input type="number" id="room-capacity" name="capacity" required>

            <label for="room-available">Trạng thái:</label>
            <select id="room-available" name="available">
                <option value="true">Đang hoạt động</option>
                <option value="false">Không hoạt động</option>
            </select>

            <button type="submit">Lưu thay đổi</button>
        </form>
    </div>
</div>

    `;
}

export async function listRoomPageTest() {
    const token = localStorage.getItem("token");
    const roomTable = document.getElementById("room-table");

    if (roomTable) {
        const rowsPerPage = 5;
        let currentPage = 1;

        async function fetchRooms(page, size) {
            try {
                const data = await callApi(`/api/v1/rooms?page=${page}&size=${size}`, 'GET', null, {
                    "Authorization": `Bearer ${token}`
                });
                return data;
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
                return null;
            }
        }

        function renderRoomTable(rooms) {
            const tbody = document.getElementById("room-table-body");
            tbody.innerHTML = "";

            rooms.forEach((room, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${room.name}</td>
                        <td>${room.capacity}</td>
                        <td>${room.available ? "Đang hoạt động" : "Không hoạt động"}</td>
                        <td>${new Date(room.createAt).toLocaleDateString("vi-VN")}</td>
                        <td>
                            <button class="edit-btn" data-id="${room.id}" data-room='${JSON.stringify(room)}'>Sửa</button>
                            <button class="delete-btn" data-id="${room.id}" data-room='${JSON.stringify(room)}'>Xoá</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }

        function renderPagination(pageCount) {
            const paginationContainer = document.getElementById("room-pagination");
            paginationContainer.innerHTML = "";

            for (let i = 1; i <= pageCount; i++) {
                const button = document.createElement("button");
                button.textContent = i;
                if (i === currentPage) {
                    button.classList.add("active");
                }
                button.addEventListener("click", () => {
                    currentPage = i;
                    loadRooms();
                });
                paginationContainer.appendChild(button);
            }
        }


        // Sửa room
        function bindEditButtons() {
            document.querySelectorAll(".edit-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const room = JSON.parse(btn.dataset.room);
                    openEditSidebar(room);
                });
            });
        }

        function openEditSidebar(room) {
            console.log("check :" , room)
            const sidebar = document.getElementById("edit-room-sidebar");
            document.getElementById("room-name").value = room.name;
            document.getElementById("room-capacity").value = room.capacity;
            document.getElementById("room-available").value = room.available;

            sidebar.classList.add("active");

            const form = document.getElementById("edit-room-form");
            form.onsubmit = async (e) => {
                e.preventDefault();
                const updatedRoom = {
                    id: room.id,
                    name: form.name.value,
                    capacity: parseInt(form.capacity.value),
                    available: form.available.value === "true"
                };

                try {
                    await callApi(`/api/v1/rooms`, 'PUT', updatedRoom, {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    });
                   showToast("Cập nhập thành công !", "success");
                    sidebar.classList.remove("active");
                    loadRooms();
                } catch (err) {
                    console.error("Cập nhật lỗi", err);
                    showToast("Cập nhập thất bại !", "error");
                }
            };
        }

        document.getElementById("close-edit-room").addEventListener("click", () => {
            document.getElementById("edit-room-sidebar").classList.remove("active");
        });


        // Xoá room 
        function bindDeleteButtons() {
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const id = btn.dataset.id;
                    handleDelete(id);
                });
            });
        }

        function handleDelete(id) {
            console.log("check :" , id)

                try {
                    callApi(`/api/v1/rooms/${id}`, 'DELETE',null, {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    });
                   showToast("Cập nhập thành công !", "success");
                    sidebar.classList.remove("active");
                    loadRooms();
                    location.reload();

                } catch (err) {
                    console.error("Cập nhật lỗi", err);
                    showToast("Cập nhập thất bại !", "error");
                }
            };
        


        async function loadRooms() {
            const data = await fetchRooms(currentPage, rowsPerPage);
            if (data) {
                renderRoomTable(data.result);
                bindEditButtons();
                bindDeleteButtons();
                renderPagination(Math.ceil(data.meta.total / rowsPerPage));
            }
        }

        loadRooms();
    }
}