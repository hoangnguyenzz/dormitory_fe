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

    let registerPayload = null; // 🔒 Biến lưu thông tin đăng ký

    // Xử lý nút đóng modal
    const closeModalBtn = document.getElementById("close-modal");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", function () {
            document.getElementById("verify-modal").style.display = "none";
        });
    }

    // Xử lý nút xác thực
    const verifyBtn = document.getElementById("verify-btn");
    if (verifyBtn) {
        verifyBtn.addEventListener("click", async function () {
            const code = document.getElementById("verify-code").value;
            const email = document.getElementById("email").value;

            try {
                const response = await callApi("/api/v1/auth/verify", "POST", {
                    email: email,
                    code: code
                });

                if (response.statusCode === 200) {

                    document.getElementById("verify-modal").style.display = "none";

                    // ✅ Gọi API đăng ký sau khi verify thành công
                    if (registerPayload) {
                        const res = await callApi("/api/v1/users/register", "POST", registerPayload);
                        if (res.statusCode === 200) {
                            showToast("Đăng ký thành công!", "success");
                            registerForm.reset();
                        } else {
                            showToast("Đăng ký không thành công!", "error");
                        }
                    }

                } else {
                    showToast(response.message, "error");
                }
            } catch (err) {
                const message = localStorage.getItem("toastMessage");
                if (message) {
                    showToast(message, "error");
                    localStorage.removeItem("toastMessage");
                }
            }
        });
    }

    // Xử lý submit form đăng ký
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

            registerPayload = {
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
                const data = await callApi("/api/v1/auth/random-code", "POST", { email: registerPayload.email });
                if (data.statusCode === 200) {
                    document.getElementById("verify-modal").style.display = "flex";
                }
            } catch (error) {
                const message = localStorage.getItem("toastMessage");
                if (message) {
                    showToast(message, "error");
                    localStorage.removeItem("toastMessage");
                }
            }
        });
    }
});
