import { callApi } from "../api/baseApi.js";




// load thong tin sinh vien
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    if (token) {
        try {
            callApi("/api/v1/auth/account", "GET", null, { "Authorization": `Bearer ${token}` })
                .then((data) => {
                    console.log("data", data);
                    document.getElementById("avatar").src = "img/sontung.jpg";
                    document.getElementById("student-name").textContent = data.user.name;
                    document.getElementById("student-id").textContent = data.studentCode;
                    document.getElementById("university").textContent = data.school;
                    document.getElementById("year").textContent = data.year;
                    document.getElementById("room").textContent = data.room ? data.room : "Đã đăng kí đâu ?";

                })
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);

        }
    }

});


function goBack() {
    window.history.back();
}
window.goBack = goBack;



function handleEditClick() {
    const fields = ["student-id", "university", "year", "room"];
    const btn = document.getElementById("edit-btn");
    if (btn.textContent === "Sửa") {
        fields.forEach(id => {
            const span = document.getElementById(id);
            const value = span.textContent;
            span.outerHTML = `<input type="text" id="${id}" value="${value}">`;
        });
        btn.textContent = "Lưu";
    } else {

        fields.forEach(id => {
            const input = document.getElementById(id);
            const value = input.value;
            input.outerHTML = `<span id="${id}">${value}</span>`;
        });

        btn.textContent = "Sửa";

    };
}
window.handleEditClick = handleEditClick;

