import { callApi } from "../apis/baseApi.js";
import { showToast } from "../thongbao/thongbao.js";



// load thong tin sinh vien
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    if (token) {
        try {
            callApi("/api/v1/auth/account", "GET", null, { "Authorization": `Bearer ${token}` })
                .then((data) => {
                    // Ảnh đại diện
                    document.getElementById("avatar").src =
                        data.avatar && data.avatar.trim() !== "" ? data.avatar : "img/default_avatar.jpg";

                    // Tên người dùng
                    document.getElementById("student-name").textContent = data.name;

                    // Email để đổi mật khẩu
                    document.getElementById("email").textContent = data.email;

                    // Kiểm tra loại người dùng
                    const infoSection = document.getElementById("info-section");
                    localStorage.setItem("userId", data.id);
                    if (data.student) {
                        // Giao diện cho sinh viên
                        infoSection.innerHTML = `
        <p><strong>Mã SV:</strong> <span id="student-id">${data.student.maSv}</span></p>
        <hr>
        <p><strong>Lớp:</strong> <span id="class">${data.student.lop}</span></p>
        <hr>
        <p><strong>Chuyên ngành: </strong> <span id="major">${data.student.chuyenNganh}</span></p>
        <hr>
        <p><strong>Phòng:</strong> <span id="room">${data.room !== null ? data.room.name : "Chưa đăng kí"}</span></p>
        <hr>
        <button class="edit-btn" id="edit-btn" onclick="handleEditClick()">Sửa</button>
    `;

                        localStorage.setItem("studentId", data.student.id);


                    } else if (data.nguoidilam) {
                        // Giao diện cho người đi làm
                        infoSection.innerHTML = `
        <p><strong>Công việc:</strong> <span id="job">${data.nguoidilam.congViec || "Không rõ"}</span></p>
        <hr>
        <p><strong>Quê quán:</strong> <span id="hometown">${data.nguoidilam.diaChi || "Không rõ"}</span></p>
        <hr>
        <p><strong>Phòng:</strong> <span id="room">${data.room !== null ? data.room.name : "Không có"}</span></p>
        <hr>
        <button class="edit-btn" id="edit-btn" onclick="handleEditClick()">Sửa</button>
    `;

                        localStorage.setItem("workerId", data.nguoidilam.id);

                    }

                });
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    }
});



function goBack() {
    window.history.back();
}
window.goBack = goBack;


// Sửa thông tin sinh viên
function handleEditClick() {
    const token = localStorage.getItem("token");
    const btn = document.getElementById("edit-btn");

    // Xác định kiểu người dùng
    const isStudent = !!localStorage.getItem("studentId");
    const isWorker = !!localStorage.getItem("workerId");

    let fields = [];
    let idKey = "";
    let updatedData = {};
    let apiEndpoint = "";
    let payload = {};

    if (isStudent) {
        fields = ["student-id", "class", "major"];
        idKey = localStorage.getItem("studentId");
        apiEndpoint = "/api/v1/students";
    } else if (isWorker) {
        fields = ["job", "hometown"];
        idKey = localStorage.getItem("workerId");
        apiEndpoint = "/api/v1/nguoidilam";
    } else {
        console.error("Không xác định được loại người dùng!");
        return;
    }

    if (btn.textContent === "Sửa") {
        fields.forEach(id => {
            const span = document.getElementById(id);
            if (span) {
                const value = span.textContent;
                span.outerHTML = `<input type="text" id="${id}" value="${value}">`;
            }
        });
        btn.textContent = "Lưu";
    } else {
        fields.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                const value = input.value;
                input.outerHTML = `<span id="${id}">${value}</span>`;
                updatedData[id] = value;
            }
        });

        if (isStudent) {
            payload = {
                id: parseInt(idKey),
                maSv: updatedData["student-id"],
                lop: updatedData["class"],
                chuyenNganh: updatedData["major"]
            };
        } else if (isWorker) {
            payload = {
                id: parseInt(idKey),
                congViec: updatedData["job"],
                diaChi: updatedData["hometown"]
            };
        }

        callApi(apiEndpoint, 'PUT', payload, {
            "Authorization": `Bearer ${token}`
        }).then((data) => {
            if (data) {
                showToast("Cập nhật thành công!", "success");
            } else {
                const message = localStorage.getItem("toastMessage");
                if (message) {
                    showToast(message, "error");
                    localStorage.removeItem("toastMessage");
                }
            }
        });

        btn.textContent = "Sửa";
    }
}

window.handleEditClick = handleEditClick;




function enableNameEdit() {
    const currentName = document.getElementById("student-name").textContent;
    const container = document.getElementById("student-name-container");

    container.innerHTML = `
        <input type="text" id="name-input" value="${currentName}" />
        <button onclick="submitNewName()" style="background: none; border: none; cursor: pointer;">
            <i class="fas fa-save"></i>
        </button>
    `;

    document.getElementById("name-input").focus();
}


function submitNewName() {
    const newName = document.getElementById("name-input").value.trim();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!newName) {
        alert("Tên không được để trống.");
        return;
    }

    const payload = {
        id: parseInt(userId),
        name: newName
    };

    callApi(`/api/v1/users/updatenameoravatar`, 'POST', payload, {
        "Authorization": `Bearer ${token}`
    }).then((data) => {
        console.log(" data ", data)
        if (data) {
            // Cập nhật lại hiển thị tên và nút bút chì
            const container = document.getElementById("student-name-container");
            container.innerHTML = `
             <span id="student-name">${newName}</span>
             <button id="edit-name-btn" onclick="enableNameEdit()" style="background: none; border: none; cursor: pointer;"> <i class="fas fa-pen"></i></button>
         `;
            showToast("Cập nhập thành công !", "success");
        } else {
            const message = localStorage.getItem("toastMessage");
            if (message) {
                showToast(message, "error");
                localStorage.removeItem("toastMessage");
            }
        }
    });
}
window.enableNameEdit = enableNameEdit;
window.submitNewName = submitNewName;




//upload avatar


async function uploadImage(event) {
    console.log("upload image")
    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dqtnkkapg/image/upload';
    const uploadPreset = 'upload-xnv2lhge';
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
        const response = await fetch(cloudinaryUrl, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        const imageUrl = data.secure_url;  // Lấy URL ảnh từ Cloudinary
        console.log('Image URL:', imageUrl);






        // Gửi URL về backend để lưu
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        const payload = {
            id: parseInt(userId),
            avatar: imageUrl
        };
        callApi(`/api/v1/users/updatenameoravatar`, 'POST', payload, {
            "Authorization": `Bearer ${token}`

        }).then((data) => {
            console.log(" data test ", data)
            if (data) {
                showToast("Cập nhập thành công !", "success");
            } else {
                const message = localStorage.getItem("toastMessage");
                if (message) {
                    showToast(message, "error");
                    localStorage.removeItem("toastMessage");
                }
            }
        });
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}
window.uploadImage = uploadImage;





//nút đổi mật khẩu//

const btn = document.getElementById('changePasswordBtn');
const form = document.getElementById('changePasswordForm');
const overlay = document.getElementById('overlay');

btn.addEventListener('click', () => {
    form.classList.toggle('hidden');
    overlay.classList.toggle('hidden');



});

// Khi click vào overlay thì ẩn form + overlay luôn cho tiện
overlay.addEventListener('click', () => {
    form.classList.add('hidden');
    overlay.classList.add('hidden');
});

function submitPasswordChange() {

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!newPassword || !confirmPassword) {
        showToast('Vui lòng nhập đầy đủ!', 'info')
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('Mật khẩu không khớp!', 'error')
        return;
    }
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    callApi(`/api/v1/users/changepassword`, 'POST', {
        "id": userId,
        "password": newPassword
    }, {
        "Authorization": `Bearer ${token}`

    }).then((data) => {
        console.log(" data test ", data)

        showToast("Cập nhập thành công !", "success");

        const message = localStorage.getItem("toastMessage");
        if (message) {
            showToast(message, "error");
            localStorage.removeItem("toastMessage");
        }

    });

    form.classList.add('hidden');
    overlay.classList.add('hidden');

    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

window.submitPasswordChange = submitPasswordChange;
