
import { callApi } from "../../../api/baseApi.js";
import { showToast } from "../../../thongbao/thongbao.js";


export function themPhuongTien() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/quanli/css/themphuongtien.css";
    document.head.appendChild(link);

    return `
    <div class="add-vehicle-form-container">
        <h2>Thêm phương tiện</h2>
        <form id="add-vehicle-form">
            <label for="license-plate">Biển số xe:</label>
            <input type="text" id="license-plate" name="licensePlate" required>

            <label for="vehicle-type">Loại xe:</label>
            <select id="vehicle-type" name="vehicleType" required>
                <option value="">-- Chọn loại xe --</option>
                <option value="Xe máy">Xe máy</option>
                <option value="Ô tô">Ô tô</option>
                <option value="Xe đạp">Xe đạp</option>
            </select>

            <label for="owner-id">Chủ xe:</label>
            <select id="owner-id" name="ownerId" required>
                <option value="">-- Chọn chủ xe --</option>
            </select>

            <button type="submit">Thêm phương tiện</button>
        </form>
    </div>
    `;
}


export async function addVehicle() {
    const addForm = document.getElementById('add-vehicle-form');
    const ownerSelect = document.getElementById('owner-id');
    const token = localStorage.getItem("token");

    // Hàm lấy danh sách chủ xe từ API và đổ vào select
    async function loadOwners() {
        try {
            const data = await callApi('/api/v1/users/novehicle', 'GET', null, {
                "Authorization": `Bearer ${token}`
            });
            console.log(data.data);

            data.data.forEach(owner => {
                const option = document.createElement("option");
                option.value = owner.id;
                option.textContent = owner.name;
                ownerSelect.appendChild(option);
            });

        } catch (error) {
            console.error("Lỗi khi load chủ xe:", error);
            showToast("Không thể tải danh sách chủ xe", "error");
        }
    }

    // Gọi hàm load khi form đã được render

    loadOwners();

    function createVehicle(vehicleData) {
        callApi(`/api/v1/vehicles`, 'POST', vehicleData, {
            "Authorization": `Bearer ${token}`
        }).then((data) => {
            if (data) {
                showToast("Thêm phương tiện thành công!", "success");
                addForm.reset();
            } else {
                const message = localStorage.getItem("toastMessage");
                if (message) {
                    showToast(message, "error");
                    localStorage.removeItem("toastMessage");
                }
            }
        });
    }

    addForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const licensePlate = document.getElementById('license-plate').value;
        const vehicleType = document.getElementById('vehicle-type').value;
        const ownerId = document.getElementById('owner-id').value;

        const vehicleData = {
            licensePlate: licensePlate,
            type: vehicleType,
            user: { id: ownerId }
        };

        createVehicle(vehicleData);
    });

}
