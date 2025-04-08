import { listRoomPage, listRoomPageTest } from "./room.js";



document.addEventListener("DOMContentLoaded", function () {

    const sidebar = document.getElementById("sidebar");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.replace('/trangchu.html');
    }
    sidebar.innerHTML =
        (role === "MANAGE" || role === "ADMIN") ?
            role === "ADMIN" ? `<ul>
                <li><a href="#room-statistics">Thống kê phòng</a></li>
                <li><a href="#student-statistics">Thống kê sinh viên</a></li>
                <li><a href="#invoice-statistics">Thống kê hóa đơn</a></li>


                <li class="has-submenu">
                    <a href="">Quản lý phòng</a>
                    <ul class="submenu">
                        <li><a href="#room">Danh sách phòng</a></li>
                        <li><a href="#">Thêm phòng</a></li>             
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#student">Quản lý sinh viên</a>
                    <ul class="submenu">
                        <li><a href="#">Thêm sinh viên</a></li>
                        <li><a href="#">Sửa sinh viên</a></li>
                        <li><a href="#">Xóa sinh viên</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#vehicle">Quản lý phương tiện</a>
                    <ul class="submenu">
                        <li><a href="#">Thêm phương tiện</a></li>
                        <li><a href="#">Sửa phương tiện</a></li>
                        <li><a href="#">Xóa phương tiện</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#invoice">Quản lý hóa đơn</a>
                    <ul class="submenu">
                        <li><a href="#">Xuất hóa đơn</a></li>
                        <li><a href="#">Gửi hóa đơn</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#contract">Quản lý hợp đồng</a>
                    <ul class="submenu">
                        <li><a href="#">Tạo hợp đồng</a></li>
                        <li><a href="#">Gửi hợp đồng</a></li>
                    </ul>
                </li>

            </ul>` :
                `<ul>
           <li class="has-submenu">
                    <a href="#room">Quản lý phòng</a>
                    <ul class="submenu">
                        <li><a href="#">Thêm phòng</a></li>
                        <li><a href="#">Sửa phòng</a></li>
                        <li><a href="#">Xóa phòng</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#student">Quản lý sinh viên</a>
                    <ul class="submenu">
                        <li><a href="#">Thêm sinh viên</a></li>
                        <li><a href="#">Sửa sinh viên</a></li>
                        <li><a href="#">Xóa sinh viên</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#vehicle">Quản lý phương tiện</a>
                    <ul class="submenu">
                        <li><a href="#">Thêm phương tiện</a></li>
                        <li><a href="#">Sửa phương tiện</a></li>
                        <li><a href="#">Xóa phương tiện</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#invoice">Quản lý hóa đơn</a>
                    <ul class="submenu">
                        <li><a href="#">Xuất hóa đơn</a></li>
                        <li><a href="#">Gửi hóa đơn</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#contract">Quản lý hợp đồng</a>
                    <ul class="submenu">
                        <li><a href="#">Tạo hợp đồng</a></li>
                        <li><a href="#">Gửi hợp đồng</a></li>
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
    localStorage.setItem("toastMessage", "Đã đăng xuất !");
    localStorage.setItem("toastType", "success");
    // window.location.replace('/trangchu.html');
    location.reload();
}

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
        case "#student":
            contentDiv.innerHTML = "<h1>About Page</h1><p>Learn more about us here.</p>";
            break;
        default:
        // code nếu không khớp case nào
    }
}