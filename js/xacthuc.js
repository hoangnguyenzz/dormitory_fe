import { callApi } from "../apis/baseApi.js";
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
                        if (data) {
                            localStorage.setItem("token", data.data.accessToken);
                            localStorage.setItem("role", data.data.user.role.name);


                            localStorage.setItem("toastMessage", "Đăng nhập thành công!");
                            localStorage.setItem("toastType", "success");
                            window.location.href = '/trangchu.html';


                        } else {
                            showToast("Sai email hoặc mật khẩu!", "error");
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
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
            const name = document.getElementById("name").value;
            const gender = document.querySelector('input[name="gioitinh"]:checked').value;
            const phone = document.getElementById("phone").value;

            const maSv = document.getElementById("maSv").value;
            const lop = document.getElementById("lop").value;
            const chuyenNganh = document.getElementById("chuyenNganh").value;

            if (password !== confirmPassword) {
                showToast("Mật khẩu không khớp!", "error");
                return;
            }

            const payload = {
                email,
                password,
                name,
                gender,
                phone,
                student: {
                    maSv,
                    lop,
                    chuyenNganh
                }
            };

            try {
                const data = await callApi("/api/v1/users/register", "POST", payload);
                console.log("data", data);

                if (data.statusCode === 400) {
                    showToast("Đăng ký không thành công!", "error");
                } else if (data.statusCode === 200) {
                    showToast("Đăng ký thành công!", "success");
                    registerForm.reset(); // reset toàn bộ form
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                showToast("Đã xảy ra lỗi. Vui lòng thử lại!", "error");
            }
        });
    }
});
