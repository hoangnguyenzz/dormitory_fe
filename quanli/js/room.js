import { callApi } from "../../api/baseApi.js";

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
                    <th></th>
                </tr>
            </thead>
            <tbody id="room-table-body">
                <!-- Dữ liệu sẽ được render bằng JS -->
            </tbody>
        </table>
    </div>
    <div class="pagination" id="room-pagination"></div>
    `;
}

export async function listRoomPageTest() {
        const token = localStorage.getItem("token");
        const roomTable = document.getElementById("room-table");
        
        if (roomTable) {
            console.log("Room table found!");
    
            const rowsPerPage = 5;  // Số lượng phòng hiển thị trên mỗi trang
            let currentPage = 1;  // Trang bắt đầu
    
            // Hàm gọi API để lấy dữ liệu phòng
            async function fetchRooms(page, size) {
                try {
                    const data = await callApi(`/api/v1/rooms?page=${page}&size=${size}`, 'GET',null,{ "Authorization": `Bearer ${token}` });
                    console.log("Check data :", data)
                    return data;  // Trả về dữ liệu từ API
                } catch (error) {
                    console.error('Lỗi khi gọi API:', error);
                    return null;  // Trả về null nếu có lỗi
                }
            }
    
            // Hàm hiển thị bảng phòng
            function renderRoomTable(rooms) {
                const tbody = document.getElementById("room-table-body");
                tbody.innerHTML = "";  // Xóa dữ liệu cũ trước khi thêm mới
    
                rooms.forEach((room, index) => {
                    const row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${room.name}</td>
                            <td>${room.capacity}</td>
                            <td>${room.available?"Đang hoạt động":"Không hoạt động"}</td>
                            <td><button class="edit-btn">Sửa</button>
                                <button class="delete-btn">Xoá</button></td>
                        </tr>
                    `;
                    tbody.innerHTML += row;  // Thêm mỗi dòng phòng vào bảng
                });
            }
    
            // Hàm hiển thị phân trang
            function renderPagination(pageCount) {
                const paginationContainer = document.getElementById("room-pagination");
                paginationContainer.innerHTML = "";  // Xóa phân trang cũ
    
                for (let i = 1; i <= pageCount; i++) {
                    const button = document.createElement("button");
                    button.textContent = i;
                    if (i === currentPage) {
                        button.classList.add("active");  // Đánh dấu trang hiện tại
                    }
                    button.addEventListener("click", () => {
                        currentPage = i;  // Cập nhật trang khi nhấn
                        loadRooms();  // Tải lại phòng và phân trang
                    });
                    paginationContainer.appendChild(button);  // Thêm nút vào phân trang
                }
            }
    
            // Hàm tải phòng và phân trang từ API
            async function loadRooms() {
                const data = await fetchRooms(currentPage, rowsPerPage);  // Lấy dữ liệu từ API
               
                if (data) {
                    renderRoomTable(data.result);  // Hiển thị danh sách phòng
                    renderPagination(Math.ceil(data.meta.total / rowsPerPage));  // Hiển thị phân trang
                }
            }
    
            loadRooms();  // Gọi hàm tải phòng lần đầu tiên
        }
    }