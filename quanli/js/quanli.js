import { listRoomPage, listRoomPageTest } from "./room/room.js";
import { addRoomPage, addRoom } from "../js/room/themmoi.js"
import { listAccountPage, listAccountPageTest } from "./account/account.js";
import { soDienNuoc, listDienNuoc } from "./diennuoc/sodiennuoc.js";
import { hoaDon, listHoaDon } from "./diennuoc/hoadon.js";
import { danhSachXe, listXe } from "./phuongtien/phuongtien.js";
import { addVehicle, themPhuongTien } from "./phuongtien/themphuongtien.js";
import { thongKePhong, thongKePhongChart } from "./thongke.js/thongkephong.js";
import { thongKeSinhVien, thongKeSinhVienChart } from "./thongke.js/thongkesinhvien.js";
import { callApi } from "../../apis/baseApi.js";
import { thongKeHoaDon, thongKeHoaDonChart } from "./thongke.js/thongkehoadon.js";
import { listViPham, viPhamTemplate } from "./vipham/vipham.js";



document.addEventListener("DOMContentLoaded", function () {

    const sidebar = document.getElementById("sidebar");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.replace('/trangchu.html');
    }


    // Load thông tin tài khoản
    callApi("/api/v1/auth/account", "GET", null, {
        "Authorization": `Bearer ${token}`
    }).then((data) => {
        console.log("data", data.role.name);
        localStorage.setItem("role", data.role.name);
        document.getElementById("account-name").textContent = data.name;
        document.getElementById("account-avatar").src = data.avatar || "/img/default_avatar.jpg";
    }).catch(err => {
        console.error("Lỗi khi load thông tin tài khoản", err);
    });



    sidebar.innerHTML =
        (role === "MANAGE" || role === "ADMIN") ?
            role === "ADMIN" ? `<ul>
                <li><a href="#room-statistics">Thống kê phòng</a></li>
                <li><a href="#student-statistics">Thống kê người dùng</a></li>
                <li><a href="#invoice-statistics">Thống kê hoá đơn</a></li>


                <li class="has-submenu">
                    <a href="">Quản lý phòng</a>
                    <ul class="submenu">
                        <li><a href="#room">Danh sách phòng</a></li>
                        <li><a href="#add-room">Thêm phòng</a></li>             
                    </ul>
                </li>   
                <li class="has-submenu">
                    <a href="#">Quản lý tài khoản</a>
                    <ul class="submenu">
                        <li><a href="#account">Danh sách tài khoản</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="">Quản lý phương tiện</a>
                    <ul class="submenu">
                        <li><a href="#vehicle">Danh sách phương tiện</a></li>
                        <li><a href="#addvehicle">Thêm phương tiện</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#">Quản lý hóa đơn</a>
                    <ul class="submenu">
                        <li><a href="#diennuoc">Chỉ số điện-nước</a></li>
                        <li><a href="#hoadon">Gửi hóa đơn</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#">Quản lý vi phạm</a>
                    <ul class="submenu">
                        <li><a href="#vipham">Danh sách vi phạm</a></li>
                    </ul>
                </li>
                 

            </ul>` :
                `<ul>
           <li class="has-submenu">
                    <a href="">Quản lý phòng</a>
                    <ul class="submenu">
                        <li><a href="#room">Danh sách phòng</a></li>
                        <li><a href="#add-room">Thêm phòng</a></li>             
                    </ul>
                </li>   
                <li class="has-submenu">
                    <a href="#">Quản lý tài khoản</a>
                    <ul class="submenu">
                        <li><a href="#account">Danh sách tài khoản</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="">Quản lý phương tiện</a>
                    <ul class="submenu">
                        <li><a href="#vehicle">Danh sách phương tiện</a></li>
                        <li><a href="#addvehicle">Thêm phương tiện</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#">Quản lý hóa đơn</a>
                    <ul class="submenu">
                        <li><a href="#diennuoc">Chỉ số điện-nước</a></li>
                        <li><a href="#hoadon">Gửi hóa đơn</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#">Quản lý vi phạm</a>
                    <ul class="submenu">
                        <li><a href="#vipham">Danh sách vi phạm</a></li>
                    </ul>
                </li>
                 

            </ul>`
            :
            ``;

    attachSubmenuToggle(); // Gọi hàm để gán sự kiện click cho các submenu
    if (location.hash) {
        loadContent(location.hash);
    }
});

//thay đổi display khi click vào
function toggleDropdown() {
    const menu = document.getElementById("dropdown-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}
window.toggleDropdown = toggleDropdown;

// Nếu click ra ngoài dropdown thì ẩn nó đi
document.addEventListener("click", (event) => {
    const account = document.getElementById("account");
    const menu = document.getElementById("dropdown-menu");
    if (!account.contains(event.target)) {
        menu.style.display = "none";
    }
});

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("studentId");
    localStorage.removeItem("userId");
    localStorage.setItem("toastMessage", "Đã đăng xuất !");
    localStorage.setItem("toastType", "success");
    // window.location.replace('/trangchu.html');
    location.reload();
}
window.logout = logout;

// Xử lí click cuộn sidebar
function attachSubmenuToggle() {
    document.querySelectorAll(".has-submenu > a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const submenu = this.nextElementSibling;
            if (submenu) {
                submenu.style.display = submenu.style.display === "block" ? "none" : "block";
            }
        });
    });
}



document.getElementById("menu-toggle").addEventListener("click", function () {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
});


document.addEventListener("click", function (event) {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("menu-toggle");

    // Nếu sidebar đang mở, và click không nằm trong sidebar hoặc nút toggle
    if (
        sidebar.classList.contains("active") &&
        !sidebar.contains(event.target) &&
        !toggleBtn.contains(event.target)
    ) {
        sidebar.classList.remove("active");
    }
});

// Lắng nghe sự thay đổi hash trong URL
window.addEventListener('hashchange', function () {
    loadContent(location.hash);
});


// Hàm để thay đổi nội dung khi hash thay đổi
function loadContent(hash) {
    const contentDiv = document.getElementById("content");
    console.log("hash :", hash)
    switch (hash) {
        case "#room":
            contentDiv.innerHTML = listRoomPage();
            listRoomPageTest();
            break;
        case "#add-room":
            contentDiv.innerHTML = addRoomPage();
            addRoom();
            break;
        case "#account":
            contentDiv.innerHTML = listAccountPage();
            listAccountPageTest();
            break;
        case "#diennuoc":
            contentDiv.innerHTML = soDienNuoc();
            listDienNuoc();
            break;
        case "#hoadon":
            contentDiv.innerHTML = hoaDon();
            listHoaDon()
            break;
        case "#vehicle":
            contentDiv.innerHTML = danhSachXe();
            listXe();
            break;
        case "#addvehicle":
            contentDiv.innerHTML = themPhuongTien();
            addVehicle();
            break;
        case "#room-statistics":
            contentDiv.innerHTML = thongKePhong();
            thongKePhongChart();
            break;
        case "#student-statistics":
            contentDiv.innerHTML = thongKeSinhVien();
            thongKeSinhVienChart();
            break;

        case "#invoice-statistics":
            contentDiv.innerHTML = thongKeHoaDon();
            thongKeHoaDonChart();
            break;
        case "#vipham":
            contentDiv.innerHTML = viPhamTemplate();
            listViPham();
            break;
        default:
    }
}