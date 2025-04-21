import { callApi } from "../api/baseApi.js";
import { showToast } from "../thongbao/thongbao.js";
import { chiTietPhong } from "./chitietphong.js";
import { hienNoiQuy } from "./noiquyktx.js";


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
    localStorage.removeItem("userId");
    localStorage.setItem("toastMessage", "Đã đăng xuất !");
    localStorage.setItem("toastType", "success");
    location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    callApi("/api/v1/auth/account", "GET", null, { "Authorization": `Bearer ${token}` })
        .then((data) => {
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

    callApi(`/api/v1/rooms`, 'GET', null)
        .then((data) => {
            console.log(" data ", data)
            if (data) {
                renderRoomCards(data.result);
                renderFilterButtons(data.result);
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
        case true: return "Đang hoạt động";
        case false: return "Không hoạt động";
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

        if (room.available === true) {
            roomDiv.classList.add("active");
        } else if (room.available === false) {
            roomDiv.classList.add("inactive");
        }

        const tenPhong = room.name;
        const tinhTrang = convertTrangThai(room.available);
        const soNguoi = `${data.data.length} / ${room.capacity}`;
        const giaPhong = new Intl.NumberFormat('vi-VN').format(room.price);

        roomDiv.innerHTML = `
            <a href="#${tenPhong}">
                <h3 class="room-title">${tenPhong}</h3>
                <p class="room-info"><strong>Trạng thái:</strong> ${tinhTrang}</p>
                <p class="room-info"><strong>Số người:</strong> ${soNguoi}</p>
                <p class="room-info"><strong>Giá phòng:</strong> ${giaPhong}</p>
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
        <button class="filter-btn" data-filter="true">Đang hoạt động</button>
        <button class="filter-btn" data-filter="false">Không hoạt động</button>
    `;

    const buttons = filterDiv.querySelectorAll(".filter-btn");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');

            const selected = button.getAttribute("data-filter");
            if (selected === "all") {
                renderRoomCards(data);
            } else if (selected === "true") {
                const filtered = data.filter(room => room.available === true);
                renderRoomCards(filtered);
            } else if (selected === "false") {
                const filtered = data.filter(room => room.available === false);
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

    const data = await callApi(`/api/v1/rooms`, 'GET', null);
    const roomNames = data.result.map(room => room.name);
    console.log("hash :", hash);

    const room = data.result.find(data => data.name === (hash.replace("#", "")));

    switch (true) {
        case roomNames.includes(hash.replace("#", "")):
            contentDiv.innerHTML = "";
            contentDiv.innerHTML = await chiTietPhong(room);
            // const btnDangKy = document.getElementById("btn-dang-ky");
            // if (btnDangKy) {
            //     btnDangKy.addEventListener("click", () => {
            //         alert("Bạn đã chọn đăng ký phòng " + hash.replace("#", ""));
            //         // Hoặc gọi hàm xử lý đăng ký thật tại đây
            //     });
            // }
            break;
        case hash === "#noiquy":
            contentDiv.innerHTML = "";
            contentDiv.innerHTML = hienNoiQuy();
        default:
            break;
    }
}






// // Xử lý chuyển trang hiển thị Nội quy
// window.addEventListener("hashchange", () => {
//     const hash = location.hash;

//     const content = document.getElementById("content");
//     const noiquy = document.getElementById("noiquy-section");

//     if (hash === "#noiquy") {
//         if (content) content.style.display = "none";
//         if (noiquy) noiquy.style.display = "block";
//     } else {
//         if (content) content.style.display = "block";
//         if (noiquy) noiquy.style.display = "none";
//     }
// });


