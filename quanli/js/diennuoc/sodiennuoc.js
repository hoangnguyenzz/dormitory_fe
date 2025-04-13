import { callApi } from "../../../api/baseApi.js";




const token = localStorage.getItem("token");



export function soDienNuoc() {

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/quanli/css/sodiennuoc.css";
  document.head.appendChild(link);

  return `
  <h2>Nhập Chỉ Số Điện & Nước</h2>
  <form action="/api/so-dien-nuoc" method="POST" class="form-inline">
    <div class="form-group">
      <label for="roomId">Phòng</label>
      <select name="roomId" id="roomId" required>
        
      </select>
    </div>

    <div class="form-group">
      <label for="soDienCuoi">Điện cuối (kWh)</label>
      <input type="number" id="soDienCuoi" name="soDienCuoi" required min="0" />
    </div>

    <div class="form-group">
      <label for="soNuocCuoi">Nước cuối (m³)</label>
      <input type="number" id="soNuocCuoi" name="soNuocCuoi" required min="0" />
    </div>

    <div class="form-group">
      <button type="submit">Gửi</button>
    </div>
  </form>

  <h3>Danh Sách Chỉ Số Đã Nhập</h3>
  <table class="reading-table">
    <thead>
      <tr>
        <th>Phòng</th>
        <th>Điện đầu</th>
        <th>Điện cuối</th>
        <th>Nước đầu</th>
        <th>Nước cuối</th>
        <th>Ngày nhập</th>
      </tr>
    </thead>
    <tbody id="readingList">
      <!-- Dữ liệu sẽ được render bằng JavaScript -->
    </tbody>
  </table>
`;
}



export async function listDienNuoc() {

  function renderRoomOptions() {

    callApi(`/api/v1/rooms`, 'GET', null, {
      "Authorization": `Bearer ${token}`
    }).then((data) => {
      console.log(" data ", data.result)
      if (data) {
        const roomList = data.result;
        const select = document.getElementById('roomId');
        select.innerHTML = '<option value="">-- Chọn phòng --</option>'; // reset mặc định

        roomList.forEach(room => {
          const option = document.createElement('option');
          option.value = room.id;
          option.textContent = room.name;
          select.appendChild(option);
        });
      } else {
        const message = localStorage.getItem("toastMessage");
        if (message) {
          showToast(message, "error");
          localStorage.removeItem("toastMessage");
        }
      }
    })

  }

  renderRoomOptions();
}