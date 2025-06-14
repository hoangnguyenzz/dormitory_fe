import { callApi } from "../../../apis/baseApi.js";
import { showToast } from "../../../thongbao/thongbao.js";

export function listRoomPage() {

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/quanli/css/room.css";
    document.head.appendChild(link);
    return `
    <div class="table-container">
        <table id="room-table">
        <h1>Danh sách phòng</h1>
        <div class="filter-buttons">
    <button id="filter-all">Tất cả</button>
    <button id="filter-active">Đang hoạt động</button>
    <button id="filter-empty">Trống</button>
    <button id="filter-inactive">Không hoạt động</button>
</div>

            <thead>
                <tr>
                    <th>STT</th>
                    <th>Tên phòng</th>
                    <th>Số người ở</th>
                    <th>Giá/Tháng (VND)</th>
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


   <!-- Danh sách sinh viên theo phòng -->
<div class="student-list-sidebar" id="student-list-sidebar">
    <div class="student-list-content">
        <span class="close-btn" id="close-student-list">&times;</span>
        <h2>Danh sách sinh viên</h2>
       
        <div class="add-student-form">
            <input type="text" id="new-student-name" placeholder="Tên sinh viên mới" />
            <ul id="student-suggestions" class="suggestion-box"></ul>
            <button id="add-student-btn">Thêm</button>
            
        </div>
         <ul id="student-list">
            <!-- Tên sinh viên sẽ render ở đây -->
        </ul>
    </div>
</div>


    `;
}
export async function listRoomPageTest() {
    const token = localStorage.getItem("token");
    const roomTable = document.getElementById("room-table");

    if (roomTable) {
        const rowsPerPage = 10;
        let currentPage = 1;
        let currentStatusFilter = '';  // Biến để lưu trạng thái lọc

        // Hàm gọi API để lấy danh sách phòng
        async function fetchRooms(page, size, status) {
            try {
                const url = status ? `/api/v1/rooms?page=${page}&size=${size}&filter=trangThai~'${status}'` : `/api/v1/rooms?page=${page}&size=${size}`;
                const data = await callApi(url, 'GET', null, {
                    "Authorization": `Bearer ${token}`
                });
                return data;
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
                return null;
            }
        }

        // Hàm render bảng phòng
        async function renderRoomTable(rooms, currentPage, pageSize) {
            const tbody = document.getElementById("room-table-body");
            tbody.innerHTML = "";

            for (let index = 0; index < rooms.length; index++) {
                const room = rooms[index];

                // Gọi API lấy danh sách sinh viên trong phòng
                const students = await callApi(`/api/v1/users/byroom/${room.id}`, 'GET', null, {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                });
                const currentCount = students?.data?.length || 0;

                // Tự động cập nhật trạng thái nếu cần
                const shouldBeAvailable = currentCount > 0;
                if (
                    (shouldBeAvailable && room.trangThai === 'TRONG') ||
                    (!shouldBeAvailable && room.trangThai === 'DANGHOATDONG')
                ) {
                    await callApi(`/api/v1/rooms`, 'PUT', {
                        id: room.id,
                        name: room.name,
                        capacity: room.capacity,
                        price: room.price,
                        trangThai: shouldBeAvailable ? 'DANGHOATDONG' : 'TRONG'
                    }, {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    });
                    await loadRooms();
                    return;
                }

                const row = `
                    <tr>
                        <td>${(currentPage - 1) * pageSize + index + 1}</td>
                        <td>${room.name}</td>
                        <td>${currentCount}/${room.capacity}</td>
                        <td>${room.price.toLocaleString('vi-VN')}</td>
                        <td class="${room.trangThai === 'DANGHOATDONG' ? 'status-active' :
                        room.trangThai === 'TRONG' ? 'status-empty' :
                            'status-inactive'
                    }">
                       ${room.trangThai === 'DANGHOATDONG' ? "Đang hoạt động" :
                        room.trangThai === 'TRONG' ? "Chưa có người" :
                            "Không hoạt động"
                    }
                    </td>
                        <td>${new Date(room.createAt).toLocaleDateString("vi-VN")}</td>
                        <td>
                            <button class="view-student-btn" data-id="${room.id}" 
                            ${room.trangThai === 'KHONGHOATDONG' ? 'disabled' : ''}>Xem thành viên </button>
                            <button class="toggle-status-btn" data-room='${encodeURIComponent(JSON.stringify(room))}'   data-status="${room.trangThai}">
                                ${room.trangThai === 'KHONGHOATDONG' ? 'Bật' : 'Dừng hoạt động'}
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            }
        }

        // Hàm render phân trang
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

        // Hàm cập nhật nút "Xem sinh viên" và "Dừng hoạt động"
        function bindViewStudentButtons() {
            document.querySelectorAll(".view-student-btn").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const roomId = btn.dataset.id;
                    openStudentSidebar(roomId);
                });
            });
        }

        // Hàm cập nhật nút "Bật/Dừng hoạt động"
        function bindToggleStatusButtons() {
            document.querySelectorAll(".toggle-status-btn").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const room = JSON.parse(decodeURIComponent(btn.dataset.room));
                    const currentStatus = btn.dataset.status;
                    if (currentStatus !== 'KHONGHOATDONG') {
                        const confirmed = confirm("Bạn có chắc chắn muốn dừng hoạt động phòng này không?");
                        if (confirmed) {
                            await callApi(`/api/v1/users/clearroom/${room.id}`, 'GET', null, {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json"
                            });
                            try {
                                await callApi(`/api/v1/rooms`, 'PUT', {
                                    id: room.id,
                                    name: room.name,
                                    capacity: room.capacity,
                                    price: room.price,
                                    trangThai: 'KHONGHOATDONG'
                                }, {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json"
                                });
                                showToast("Cập nhật trạng thái thành công !", "success");
                                loadRooms();

                            } catch (err) {
                                console.error("Lỗi cập nhật trạng thái:", err);
                                showToast("Có lỗi xảy ra!", "error");
                            }
                        }
                    } else {
                        try {
                            await callApi(`/api/v1/rooms`, 'PUT', {
                                id: room.id,
                                name: room.name,
                                capacity: room.capacity,
                                price: room.price,
                                trangThai: 'TRONG'
                            }, {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json"
                            });
                            showToast("Cập nhật trạng thái thành công !", "success");
                            loadRooms();
                        } catch (err) {
                            console.error("Lỗi cập nhật trạng thái:", err);
                            showToast("Có lỗi xảy ra!", "error");
                        }
                    }
                });
            });
        }
        async function openStudentSidebar(roomId) {

            const sidebar = document.getElementById("student-list-sidebar");
            const studentList = document.getElementById("student-list");
            const addBtn = document.getElementById("add-student-btn");
            const nameInput = document.getElementById("new-student-name");
            const suggestionBox = document.getElementById("student-suggestions");

            // tìm kiếm sinh viên
            nameInput.addEventListener("input", async () => {
                const keyword = nameInput.value.trim();
                suggestionBox.innerHTML = "";

                if (!keyword) return;

                try {
                    const data = await callApi(`/api/v1/users?filter=name~'${keyword}'`, 'GET', null, {
                        "Authorization": `Bearer ${token}`
                    });

                    const students = data?.result || [];

                    const uniqueStudents = [];
                    const seenIds = new Set();

                    students.forEach(student => {
                        if (!seenIds.has(student.id)) {
                            seenIds.add(student.id);
                            uniqueStudents.push(student);
                        }
                    });

                    uniqueStudents.forEach(student => {
                        const li = document.createElement("li");
                        li.textContent = student.name;

                        li.addEventListener("click", () => {
                            nameInput.value = `${student.id} - ${student.name}`;
                            suggestionBox.innerHTML = "";
                        });

                        suggestionBox.appendChild(li);
                    });
                } catch (error) {
                    console.error("Lỗi khi tìm sinh viên:", error);
                }
            });
            // hủy bỏ gợi ý khi click ra ngoài
            document.addEventListener("click", (e) => {
                const isClickInsideInput = nameInput.contains(e.target);
                const isClickInsideSuggestion = suggestionBox.contains(e.target);

                if (!isClickInsideInput && !isClickInsideSuggestion) {
                    suggestionBox.innerHTML = "";
                }
            });

            sidebar.classList.add("active");

            async function loadStudents() {
                await callApi(`/api/v1/users/byroom/${roomId}`, 'GET', null, {
                    "Authorization": `Bearer ${token}`
                }).then((data) => {
                    console.log(" data ", data.data)
                    if (data) {
                        studentList.innerHTML = "";
                        data.data.forEach(student => {
                            const li = document.createElement("li");
                            li.textContent = student.name;

                            const deleteBtn = document.createElement("button");
                            deleteBtn.textContent = "x";
                            deleteBtn.classList.add("delete-student-btn");
                            deleteBtn.addEventListener("click", async () => {
                                await callApi(`/api/v1/users/deleteuserfromroom/${student.id}`, 'POST', null, {
                                    "Authorization": `Bearer ${token}`
                                });
                                loadStudents();
                            });

                            li.appendChild(deleteBtn);
                            studentList.appendChild(li);
                        });
                    } else {
                        const message = localStorage.getItem("toastMessage");
                        if (message) {
                            showToast(message, "error");
                            localStorage.removeItem("toastMessage");
                        }
                    }
                });


            }

            addBtn.onclick = async () => {
                const userId = nameInput.value.split("-")[0].trim();
                console.log("id new user:", userId)
                if (userId) {
                    await callApi(`/api/v1/users`, 'PUT', { id: userId, room: { id: roomId } }, {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }).then((data) => {
                        console.log(" data ", data)
                        if (data) {
                            showToast("Thêm mới thành công !", "success");
                            nameInput.value = "";
                            loadStudents();
                        } else {

                            showToast("Không tìm thấy người này", "error");
                            localStorage.removeItem("toastMessage");
                        }
                    }

                    );


                }
            };

            loadStudents();
        }
        document.getElementById("close-student-list").addEventListener("click", () => {
            document.getElementById("student-list-sidebar").classList.remove("active");
        });

        // Sự kiện lọc trạng thái
        document.getElementById("filter-all").addEventListener("click", () => {
            currentStatusFilter = '';  // Lọc tất cả
            loadRooms();
        });

        document.getElementById("filter-active").addEventListener("click", () => {
            currentStatusFilter = '0';  // Lọc phòng đang hoạt động
            loadRooms();
        });

        document.getElementById("filter-empty").addEventListener("click", () => {
            currentStatusFilter = '1';  // Lọc phòng trống
            loadRooms();
        });

        document.getElementById("filter-inactive").addEventListener("click", () => {
            currentStatusFilter = '2';  // Lọc phòng không hoạt động
            loadRooms();
        });

        // Hàm load phòng
        async function loadRooms() {
            const data = await fetchRooms(currentPage, rowsPerPage, currentStatusFilter);
            if (data) {
                await renderRoomTable(data.result, currentPage, rowsPerPage);
                bindViewStudentButtons();
                bindToggleStatusButtons();
                renderPagination(Math.ceil(data.meta.total / rowsPerPage));
            }
        }

        loadRooms();
    }
}
