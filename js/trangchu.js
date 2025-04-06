import { showToast } from "../thongbao/thongbao.js";



// function toggleMenu() {
//     document.querySelector(".nav-links").classList.toggle("active");
// }

//thay đổi display khi click vào
function toggleDropdown() {
    const menu = document.getElementById("dropdown-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function updateAccount(isLoggedIn, userName, userImage) {
    const accountDiv = document.getElementById("account");
    if (isLoggedIn) {
        const role = localStorage.getItem("role");
        accountDiv.innerHTML =
            role === "ADMIN" || role === "MANAGE"
                ?
                `<span>${userName}</span>
            <img src="${userImage}" alt="Avatar" id="avatar-img">
            <div class="dropdown-menu" id="dropdown-menu">
                <a href="#">Thông tin</a>
                <a href="quanli/quanli.html">Trang quản trị</a>
                <a href="#" id="logout-btn" >Đăng xuất</a>
            </div>` :
                `<span>${userName}</span>
            <img src="${userImage}" alt="Avatar" id="avatar-img">
            <div class="dropdown-menu" id="dropdown-menu">
                <a href="#">Thông tin</a>
                <a href="#" id="logout-btn" >Đăng xuất</a>
            </div>`
            ;

        // dùng thay thế onclick 
        document.getElementById("avatar-img").addEventListener("click", toggleDropdown);
        document.getElementById("logout-btn").addEventListener("click", logout);

    } else {
        accountDiv.innerHTML = '<a href="dangnhap.html" id="login-btn">Đăng nhập</a>';
    }
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
    updateAccount(false);
    localStorage.removeItem("token"); // Xóa token khỏi localStorage
    localStorage.setItem("toastMessage", "Đã đăng xuất !");
    localStorage.setItem("toastType", "success");
    location.reload();
}

// cập nhật trạng thái đăng nhập
document.addEventListener("DOMContentLoaded", function () {
    const checked = localStorage.getItem("token");
    if (checked) {
        const isLoggedIn = true; // Thay đổi giá trị này để kiểm tra
        const userName = "Nguyễn Văn A";
        const userImage = "img/sontung.jpg"; // Ảnh mẫu
        updateAccount(isLoggedIn, userName, userImage);
    } else {
        updateAccount(false);
    }
});




//show message trong localStorage
document.addEventListener("DOMContentLoaded", function () {
    const message = localStorage.getItem("toastMessage");
    const type = localStorage.getItem("toastType");

    if (message) {
        showToast(message, type || "info");

        // Xóa sau khi hiển thị để không bị lặp lại
        localStorage.removeItem("toastMessage");
        localStorage.removeItem("toastType");
    }
});