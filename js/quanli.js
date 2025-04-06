



document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    sidebar.innerHTML = `<ul>
                <li><a href="#">Thống kê phòng</a></li>
                <li><a href="#">Thống kê sinh viên</a></li>
                <li><a href="#">Thống kê hóa đơn</a></li>


                <li class="has-submenu">
                    <a href="#">Quản lý phòng</a>
                    <ul class="submenu">
                        <li><a href="#">Thêm phòng</a></li>
                        <li><a href="#">Sửa phòng</a></li>
                        <li><a href="#">Xóa phòng</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#">Quản lý sinh viên</a>
                    <ul class="submenu">
                        <li><a href="#">Thêm sinh viên</a></li>
                        <li><a href="#">Sửa sinh viên</a></li>
                        <li><a href="#">Xóa sinh viên</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#">Quản lý phương tiện</a>
                    <ul class="submenu">
                        <li><a href="#">Thêm phương tiện</a></li>
                        <li><a href="#">Sửa phương tiện</a></li>
                        <li><a href="#">Xóa phương tiện</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#">Quản lý hóa đơn</a>
                    <ul class="submenu">
                        <li><a href="#">Xuất hóa đơn</a></li>
                        <li><a href="#">Gửi hóa đơn</a></li>
                    </ul>
                </li>
                <li class="has-submenu">
                    <a href="#">Quản lý hợp đồng</a>
                    <ul class="submenu">
                        <li><a href="#">Tạo hợp đồng</a></li>
                        <li><a href="#">Gửi hợp đồng</a></li>
                    </ul>
                </li>

            </ul>`;
    attachSubmenuToggle(); // Gọi hàm để gán sự kiện click cho các submenu
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
    alert("Bạn đã đăng xuất");
    // Thêm xử lý đăng xuất ở đây
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
