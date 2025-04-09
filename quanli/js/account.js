import { callApi } from "../../api/baseApi.js";

export function listAccountPage() {
    return `
    <div class="table-container">
        <table id="account-table">
        <h1>Danh sách tài khoản</h1>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Tên sinh viên</th>
                    <th>Email</th>
                    <th>SĐT</th>
                    
                </tr>
            </thead>
            <tbody id="account-table-body">
                <!-- Dữ liệu sẽ được render bằng JS -->
            </tbody>
        </table>
    </div>
    <div class="pagination" id="account-pagination"></div>
    `;
}

// export async function listAccountPageTest() {
//         const token = localStorage.getItem("token");
//         const accountTable = document.getElementById("account-table");
        
//         if (accountTable) {
//             console.log("account table found!");
    
//             const rowsPerPage = 5;  // Số lượng phòng hiển thị trên mỗi trang
//             let currentPage = 1;  // Trang bắt đầu
    
//             // Hàm gọi API để lấy dữ liệu phòng
//             async function fetchAccounts(page, size) {
//                 try {
//                     const data = await callApi(`/api/v1/rooms?page=${page}&size=${size}`, 'GET',null,{ "Authorization": `Bearer ${token}` });
//                     console.log("Check data :", data)
//                     return data;  // Trả về dữ liệu từ API
//                 } catch (error) {
//                     console.error('Lỗi khi gọi API:', error);
//                     return null;  // Trả về null nếu có lỗi
//                 }
//             }
    
//             // Hàm hiển thị bảng phòng
//             function renderaccountTable(Accounts) {
//                 const tbody = document.getElementById("account-table-body");
//                 tbody.innerHTML = "";  // Xóa dữ liệu cũ trước khi thêm mới
    
//                 Accounts.forEach((account, index) => {
//                     const row = `
//                         <tr>
//                             <td>${index + 1}</td>
//                             <td>${account.name}</td>
//                             <td>${account.email}</td>
//                             <td>${account.phone}</td>
//                             <td><button class="edit-btn">Sửa</button>
//                                 <button class="delete-btn">Xoá</button></td>
//                         </tr>
//                     `;
//                     tbody.innerHTML += row;  // Thêm mỗi dòng phòng vào bảng
//                 });
//             }
    
//             // Hàm hiển thị phân trang
//             function renderPagination(pageCount) {
//                 const paginationContainer = document.getElementById("account-pagination");
//                 paginationContainer.innerHTML = "";  // Xóa phân trang cũ
    
//                 for (let i = 1; i <= pageCount; i++) {
//                     const button = document.createElement("button");
//                     button.textContent = i;
//                     if (i === currentPage) {
//                         button.classList.add("active");  // Đánh dấu trang hiện tại
//                     }
//                     button.addEventListener("click", () => {
//                         currentPage = i;  // Cập nhật trang khi nhấn
//                         loadAccounts();  // Tải lại phòng và phân trang
//                     });
//                     paginationContainer.appendChild(button);  // Thêm nút vào phân trang
//                 }
//             }
    
//             // Hàm tải phòng và phân trang từ API
//             async function loadAccounts() {
//                 const data = await fetchAccounts(currentPage, rowsPerPage);  // Lấy dữ liệu từ API
               
//                 if (data) {
//                     renderaccountTable(data.result);  // Hiển thị danh sách phòng
//                     renderPagination(Math.ceil(data.meta.total / rowsPerPage));  // Hiển thị phân trang
//                 }
//             }
    
//             loadAccounts();  // Gọi hàm tải phòng lần đầu tiên
//         }
//     }