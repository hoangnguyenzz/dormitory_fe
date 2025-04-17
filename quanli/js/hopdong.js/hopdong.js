// import { callApi } from "../../../api/baseApi.js";
// import { showToast } from "../../../thongbao/thongbao.js";

// const token = localStorage.getItem("token");

// export function hoaDon() {

//     const link = document.createElement("link");
//     link.rel = "stylesheet";
//     link.href = "/quanli/css/hoadon.css";
//     document.head.appendChild(link);

//     return `
//     <h2>Danh Sách Hóa Đơn</h2>

//     <div class="filter-group">
//   <label for="filterRoomId">Lọc theo phòng:</label>
//   <select id="filterRoomId">
//     <option value="">-- Tất cả phòng --</option>
//   </select>
// </div>

//     <table class="invoice-table">
//       <thead>
//         <tr>
//           <th>STT</th>
//           <th>Phòng</th>
//           <th>Số điện</th>
//           <th>Số nước</th>
//           <th>Tiền điện (VNĐ)</th>
//           <th>Tiền nước (VNĐ)</th>
//           <th>Tổng tiền (VNĐ)</th>
//           <th>Trạng thái</th>
//           <th>Ngày tạo</th>
//           <th>Thao tác</th>
//         </tr>
//       </thead>
//       <tbody id="invoiceList">
//         <!-- Dữ liệu sẽ được render bằng JavaScript -->
//       </tbody>
//     </table>
//     <div class="pagination" id="invoice-pagination"></div>
//   `;
// }