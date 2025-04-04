function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("active");
}

function updateAccount(isLoggedIn, userName, userImage) {
    const accountDiv = document.getElementById("account");
    if (isLoggedIn) {
        accountDiv.innerHTML = `
            <span>${userName}</span>
            <img src="${userImage}" alt="Avatar" onclick="toggleDropdown()">
            <div class="dropdown-menu" id="dropdown-menu">
                <a href="#">Thông tin</a>
                <a href="quanli.html">Trang quản trị</a>
                <a href="#" onclick="logout()">Đăng xuất</a>
            </div>
        `;
    } else {
        accountDiv.innerHTML = '<a href="dangnhap.html" id="login-btn">Đăng nhập</a>';
    }
}

function toggleDropdown() {
    document.getElementById("dropdown-menu").classList.toggle("active");
}

function logout() {
    alert("Bạn đã đăng xuất!");
    updateAccount(false);
}

// Ví dụ: cập nhật trạng thái đăng nhập
document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = false; // Thay đổi giá trị này để kiểm tra
    const userName = "Nguyễn Văn A";
    const userImage = "img/sontung.jpg"; // Ảnh mẫu
    updateAccount(isLoggedIn, userName, userImage);
});
