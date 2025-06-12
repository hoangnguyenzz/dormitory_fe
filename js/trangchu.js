import { callApi } from "../apis/baseApi.js";
import { showToast } from "../thongbao/thongbao.js";
import { chiTietPhong, handleDangKyPhong } from "./chitietphong.js";
import { hienGioiThieu } from "./gioithieu.js";
import { hienLienHe } from "./lienhe.js";
import { hienNoiQuy } from "./noiquyktx.js";
import { danhSachViPham } from "./vipham.js";


function toggleDropdown() {
    const menu = document.getElementById("dropdown-menu");
    if (menu) {
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    }
}

function updateAccount(isLoggedIn, userName, userImage) {
    const accountDiv = document.getElementById("account");
    if (!accountDiv) return;

    if (isLoggedIn) {
        const role = localStorage.getItem("role");
        accountDiv.innerHTML =
            role === "ADMIN" || role === "MANAGE"
                ?
                `<span>${userName}</span>
                <img src="${userImage}" alt="Avatar" id="avatar-img">
                <div class="dropdown-menu" id="dropdown-menu">
                    <a href="thongtin.html">Thông tin</a>
                    <a href="quanli/quanli.html">Trang quản trị</a>
                    <a href="#" id="logout-btn" >Đăng xuất</a>
                </div>` :
                `<span>${userName}</span>
                <img src="${userImage}" alt="Avatar" id="avatar-img">
                <div class="dropdown-menu" id="dropdown-menu">
                    <a href="thongtin.html">Thông tin</a>
                    <a href="#" id="logout-btn" >Đăng xuất</a>
                </div>`;

        document.getElementById("avatar-img")?.addEventListener("click", toggleDropdown);
        document.getElementById("logout-btn")?.addEventListener("click", logout);

    } else {
        accountDiv.innerHTML = '<a href="dangnhap.html" id="login-btn">Đăng nhập</a>';
    }
}

document.addEventListener("click", (event) => {
    const account = document.getElementById("account");
    const menu = document.getElementById("dropdown-menu");
    if (menu && account && !account.contains(event.target)) {
        menu.style.display = "none";
    }
});

function logout() {
    updateAccount(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("studentId");
    localStorage.removeItem("workerId");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    localStorage.setItem("toastMessage", "Đã đăng xuất !");
    localStorage.setItem("toastType", "success");
    location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    callApi("/api/v1/auth/account", "GET", null, { "Authorization": `Bearer ${token}` })
        .then((data) => {
            localStorage.setItem("role", data.role.name);
            // if (data.student) {
            //     localStorage.setItem("userType", "STUDENT");
            // } else if (data.nguoidilam) {
            //     localStorage.setItem("userType", "WORKER");
            // }
            console.log("data", data);
            if (token) {
                const isLoggedIn = true;
                const userName = data.name;
                const userImage = data.avatar && data.avatar.trim() !== "" ? data.avatar : "img/default_avatar.jpg";
                updateAccount(isLoggedIn, userName, userImage);

            } else {
                updateAccount(false);
            }
        })
    const message = localStorage.getItem("toastMessage");
    const type = localStorage.getItem("toastType");

    if (message) {
        showToast(message, type || "info");
        localStorage.removeItem("toastMessage");
        localStorage.removeItem("toastType");
    }
    const userType = localStorage.getItem("userType");
    callApi(`/api/v1/rooms?page=0&size=50`, 'GET', null)
        .then((data) => {
            console.log(" data ", data)
            if (data) {
                // Lọc ds phòng theo userType 
                const filteredRooms = userType ? data.result.filter(room => room.doiTuong === userType) : data.result;

                renderRoomCards(filteredRooms);
                renderFilterButtons(filteredRooms);
            } else {
                const message = localStorage.getItem("toastMessage");
                if (message) {
                    showToast(message, "error");
                    localStorage.removeItem("toastMessage");
                }
            }
        });

    renderFilterButtons();


});

function convertTrangThai(status) {
    switch (status) {
        case 'DANGHOATDONG': return "Đang hoạt động";
        case 'TRONG': return "Trống";
        case 'KHONGHOATDONG': return "Không hoạt động";
        default: return "Không rõ";
    }
}

async function renderRoomCards(rooms) {
    const main = document.getElementById("main");
    if (!main) return;

    main.innerHTML = "";

    // Tạo mảng promises để gọi API cho từng room
    const promises = rooms.map(room => {
        return callApi(`/api/v1/users/byroom/${room.id}`, 'GET', null)
            .then(data => ({ room, data })); // Giữ lại cả room lẫn data trả về
    });

    // Đợi tất cả API hoàn thành
    const results = await Promise.all(promises);

    // Hiển thị từng room theo đúng thứ tự ban đầu
    results.forEach(({ room, data }) => {
        console.log(room.id, data.data.length);

        const roomDiv = document.createElement("div");
        roomDiv.classList.add("room-card");

        if (room.trangThai === 'DANGHOATDONG') {
            roomDiv.classList.add("active");
        } else if (room.trangThai === 'TRONG') {
            roomDiv.classList.add("empty");
        } else if (room.trangThai === 'KHONGHOATDONG') {
            roomDiv.classList.add("inactive");
        }

        const tenPhong = room.name;
        const tinhTrang = convertTrangThai(room.trangThai);
        const soNguoi = `${data.data.length} / ${room.capacity}`;
        const giaPhong = new Intl.NumberFormat('vi-VN').format(room.price);

        roomDiv.innerHTML = `
        <a href="#${tenPhong}" class="room-card" style="text-decoration: none;">
          <div class="modern-room-card">
            <div class="room-header">
              <h3>${tenPhong}</h3>
             <span class="status ${tinhTrang === 'Đang hoạt động' ? 'active' : (tinhTrang === 'Trống') ? 'empty' : 'inactive'}">${tinhTrang}</span>
            </div>
            <div class="room-details">
              <p><i class="fas fa-user-friends"></i> Số người: ${soNguoi}</p>
              <p><i class="fas fa-dollar-sign"></i> Giá phòng: ${giaPhong}</p>
            </div>
          </div>
        </a>
      `;



        main.appendChild(roomDiv);
    });
}


function renderFilterButtons(data) {
    const filterDiv = document.getElementById("filter");
    if (!filterDiv) return;

    filterDiv.innerHTML = `
        <strong><p>Tình trạng phòng:</p></strong>
        <button class="filter-btn" data-filter="all">Tất cả</button>
        <button class="filter-btn" id="green" data-filter="DANGHOATDONG">Đang hoạt động</button>
        <button class="filter-btn" id="blue" data-filter="TRONG">Trống</button>
        <button class="filter-btn" id="red" data-filter="KHONGHOATDONG">Không hoạt động</button>
    `;

    const buttons = filterDiv.querySelectorAll(".filter-btn");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');

            const selected = button.getAttribute("data-filter");
            if (selected === "all") {
                renderRoomCards(data);
            } else if (selected === "DANGHOATDONG") {
                const filtered = data.filter(room => room.trangThai === selected);
                renderRoomCards(filtered);
            } else if (selected === "TRONG") {
                const filtered = data.filter(room => room.trangThai === selected);
                renderRoomCards(filtered);
            }
            else if (selected === "KHONGHOATDONG") {
                const filtered = data.filter(room => room.trangThai === selected);
                renderRoomCards(filtered);
            }
        });
    });
}





window.addEventListener('hashchange', function () {
    loadContent(location.hash);
});




async function loadContent(hash) {
    const contentDiv = document.getElementById("content");
    if (!contentDiv) return;
    const token = localStorage.getItem("token");

    const data = await callApi(`/api/v1/rooms?page=0&size=50`, 'GET', null);
    const roomNames = data.result.map(room => room.name);
    console.log("hash :", hash);

    const room = data.result.find(data => data.name === (hash.replace("#", "")));
    console.log("room :", room);
    switch (true) {
        case roomNames.includes(hash.replace("#", "")):
            contentDiv.innerHTML = "";
            contentDiv.innerHTML = await chiTietPhong(room);
            handleDangKyPhong(room);
            break;
        case hash === "#noiquy":
            contentDiv.innerHTML = "";
            contentDiv.innerHTML = hienNoiQuy();
            break;
        case hash === "#gioithieu":
            contentDiv.innerHTML = "";
            contentDiv.innerHTML = hienGioiThieu();
            break;
        case hash === "#lienhe":
            contentDiv.innerHTML = "";
            contentDiv.innerHTML = hienLienHe();
            break;
        case hash === "#vipham":
            contentDiv.innerHTML = "";
            const html = await danhSachViPham(); // ✅ chờ kết quả
            contentDiv.innerHTML = html;
            break;

        default:
            break;
    }
}
