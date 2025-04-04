// admin-script.js
function toggleDropdown() {
    const menu = document.getElementById("dropdown-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

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

document.querySelectorAll(".has-submenu > a").forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        const submenu = this.nextElementSibling;
        if (submenu) {
            submenu.style.display = submenu.style.display === "block" ? "none" : "block";
        }
    });
});
