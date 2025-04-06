import { callApi } from "../api/baseApi.js";
import { showToast } from "../thongbao/thongbao.js";


// Đăng nhập 
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        console.log("Login form:");
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
                            // alert("Thông tin tài khoản , mật khẩu sai !")
                            showToast("Sai email hoặc mật khẩu!", "error");

                        } else if (data.statusCode === 200) {
                            localStorage.setItem("token", data.data.accessToken);
                            localStorage.setItem("role", data.data.user.role);

                            localStorage.setItem("toastMessage", "Đăng nhập thành công!");
                            localStorage.setItem("toastType", "success");
                            window.location.href = '/trangchu.html';
                        }
                    })
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);

            }
        });
    }
});



// Đăng ký
document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        console.log("Register form:");
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
            const name = document.getElementById("name").value;
            const gender = document.querySelector('input[name="gioitinh"]:checked').value;

            if (password === confirmPassword) {
                console.log("Email:", email);
                console.log("Password:", password);
                console.log("Confirm Password:", confirmPassword);
                console.log("Name:", name);
                console.log("gender:", gender);

                try {
                    callApi("/api/v1/users/register", "POST", { email, password, name, gender })
                        .then((data) => {
                            console.log("data", data);
                            if (data.statusCode === 400) {
                                showToast("Đăng ký không thành công!", "error");

                            } else if (data.statusCode === 200) {

                                showToast("Đăng ký thành công!", "success");
                                document.getElementById("email").value = "";
                                document.getElementById("password").value = "";
                                document.getElementById("confirm-password").value = "";

                                document.getElementById("name").value = "";
                            }
                        })
                } catch (error) {
                    console.error("Lỗi khi gọi API:", error);

                }
            } else {
                showToast("Mật khẩu không khớp!", "error");
            }
        });
    }
});