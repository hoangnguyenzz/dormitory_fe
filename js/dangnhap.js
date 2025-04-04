import { callApi } from "../api/baseApi.js";



document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    console.log("Login form:");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            console.log("Email:", email);
            console.log("Password:", password);
            try {

                callApi("/api/v1/auth/login", "POST", { email, password })
                    .then((data) => {
                        console.log("data", data);
                        if (data.statusCode === 400) {
                            alert("Thông tin tài khoản , mật khẩu sai !")
                        } else if (data.statusCode === 200) {
                            localStorage.setItem("token", data.data.accessToken);
                            alert("Đăng nhập thành công !")
                        }
                    })
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);

            }
        });
    }
});
