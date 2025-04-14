import { callApi } from "../../../api/baseApi.js";
import { showToast } from "../../../thongbao/thongbao.js";


const token = localStorage.getItem("token");



export function soDienNuoc() {

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/quanli/css/sodiennuoc.css";
  document.head.appendChild(link);

  return `
  <h2>Nhập Chỉ Số Điện & Nước</h2>
  <form action="/api/so-dien-nuoc" method="POST" class="form-inline" id="add-form">
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
      <button type="submit">Thêm</button>
    </div>
  </form>

  <h3>Danh Sách Chỉ Số Đã Nhập</h3>
  <table class="reading-table">
    <thead>
      <tr>
        <th>STT</th>  
        <th>Phòng</th>
        <th>Điện đầu</th>
        <th>Điện cuối</th> 
        <th>Nước đầu</th>
        <th>Nước cuối</th>
        <th>Ngày nhập</th>
        <th></th>
      </tr>
    </thead>
    <tbody id="readingList">
      <!-- Dữ liệu sẽ được render bằng JavaScript -->
    </tbody>
  </table>
  <div class="pagination" id="reading-pagination"></div>

`;
}



export async function listDienNuoc() {

  const rowsPerPage = 5;
  let currentPage = 1;
  function renderRoomOptions() {

    callApi(`/api/v1/rooms`, 'GET', null, {
      "Authorization": `Bearer ${token}`
    }).then((data) => {
      console.log(" data ", data.result)
      if (data) {
        const roomList = data.result;
        const select = document.getElementById('roomId');
        select.innerHTML = '<option value="">-- Chọn phòng --</option>';

        roomList.forEach(room => {
          const option = document.createElement('option');
          option.value = room.id;
          option.textContent = room.name;
          select.appendChild(option);
        });
        // Gán sự kiện change sau khi đã render options
        select.addEventListener('change', function () {
          const selectedRoomId = this.value;
          const selectedRoom = roomList.find(room => room.id == selectedRoomId);
          if (selectedRoom) {
            console.log("Thông tin phòng được chọn:", selectedRoom);
          }
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





  // Lắng nghe submit
  const addForm = document.getElementById('add-form');
  addForm.addEventListener('submit', async function (e) {
    e.preventDefault();


    const roomId = document.getElementById('roomId').value;
    const soDienCuoi = document.getElementById('soDienCuoi').value;
    const soNuocCuoi = document.getElementById('soNuocCuoi').value;

    const payload = {
      roomId: roomId,
      soDienCuoi: Number(soDienCuoi),
      soNuocCuoi: Number(soNuocCuoi)
    };
    console.log("check", payload)

    await callApi(`/api/v1/sodiennuoc`, 'POST', payload, {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }).then((data) => {
      console.log(" data ", data)
      if (data) {
        showToast("Thêm mới thành công !", "success");
        addForm.reset();
        loadReadingList(currentPage, rowsPerPage);
      } else {
        const message = localStorage.getItem("toastMessage");
        if (message) {
          showToast(message, "error");
          localStorage.removeItem("toastMessage");
        }
      }

    })

  });


  async function loadReadingList(page, pageSize) {

    await callApi(`/api/v1/sodiennuoc?page=${page}&size=${pageSize}`, 'GET', null, {
      "Authorization": `Bearer ${token}`
    }).then((data) => {


      const tbody = document.getElementById("readingList");
      tbody.innerHTML = '';

      data.result.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${(page - 1) * pageSize + index + 1}</td>
            <td>${item.room?.name || '---'}</td>
            <td>${item.soDienDau}</td>
            <td>${item.soDienCuoi}</td>
            <td>${item.soNuocDau}</td>
            <td>${item.soNuocCuoi}</td>
            <td>${new Date(item.createAt).toLocaleDateString('vi-VN')}</td>
            <td>
              <button class="taohoadon-btn" data-id="${item.id}" data-item='${JSON.stringify(item)}'>Tạo hoá đơn</button>
              <button class="delete-btn" data-id="${item.id}">Xoá</button>
            </td>
          `;
        tbody.appendChild(tr);
      });
      taoHoaDonButtons();
      bindDeleteButtons();
      renderReadingPagination(data.meta.total, page, pageSize);

    })
  }

  function taoHoaDonButtons() {
    document.querySelectorAll(".taohoadon-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        try {
          // const item = JSON.parse(decodeURIComponent(btn.dataset.item));
          const id = btn.dataset.id;
          console.log("checked :", id);

          callApi(`/api/v1/hoadon/${id}`, 'POST', null, {
            "Authorization": `Bearer ${token}`
          }).then((data) => {
            try {
              showToast("Đã tạo hoá đơn !", "success");
            } catch (err) {
              const message = localStorage.getItem("toastMessage");
              if (message) {
                showToast(message, "error");
                localStorage.removeItem("toastMessage");
              }
            }
          });
        } catch (err) {
          console.error("Lỗi khi parse item:", err);
        }
      });
    });
  }


  function bindDeleteButtons() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;

        callApi(`/api/v1/sodiennuoc/${id}`, 'DELETE', null, {
          "Authorization": `Bearer ${token}`
        }).then((data) => {
          try {
            showToast("Cập nhật thành công!", "success");
            loadReadingList(currentPage, rowsPerPage);

          } catch (err) {
            const message = localStorage.getItem("toastMessage");
            if (message) {
              showToast(message, "error");
              localStorage.removeItem("toastMessage");
            }
          }
        });
      });
    });
  }

  function renderReadingPagination(totalItems, current, pageSize) {
    const paginationContainer = document.getElementById("reading-pagination");
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(totalItems / pageSize);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === current) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", () => {
        currentPage = i; // ✅ cập nhật biến toàn cục
        loadReadingList(currentPage, pageSize);
      });

      paginationContainer.appendChild(btn);
    }
  }



  async function loadDienNuoc() {
    renderRoomOptions();
    loadReadingList(currentPage, rowsPerPage);

  }
  loadDienNuoc();
}