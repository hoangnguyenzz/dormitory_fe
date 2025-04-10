
import { callApi } from "../../../api/baseApi.js";
import { showToast } from "../../../thongbao/thongbao.js";



export function addRoomPage() {
    return `<div class="add-room-form-container">
    <h2>Thêm mới phòng</h2>
    <form id="add-room-form">
        <label for="add-room-name">Tên phòng:</label>
        <input type="text" id="add-room-name" name="name" required>

        <label for="add-room-capacity">Số người ở:</label>
        <input type="number" id="add-room-capacity" name="capacity" required min="1">

        <label for="add-room-available">Trạng thái:</label>
        <select id="add-room-available" name="available" required>
            <option value="true">Đang hoạt động</option>
            <option value="false">Không hoạt động</option>
        </select>

        <button type="submit">Thêm phòng</button>
    </form>
</div>
`;

}

export async function addRoom() {
    const addForm = document.getElementById('add-room-form');
    if(addForm){
    const token = localStorage.getItem("token");  



 function createRoom(roomData) {
        console.log(roomData)
            try {
               const data= callApi(`/api/v1/rooms`, 'POST', roomData, {
                    "Authorization": `Bearer ${token}`
                });
                showToast("Thêm mới thành công !", "success");
                return data;
                
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
                showToast("Thêm mới thất bại !", "error");
                return null;
               
            }
        }
        document.getElementById('add-room-form').addEventListener('submit', (event) => {
            event.preventDefault(); 
                // Lấy giá trị từ form
    const roomName = document.getElementById('add-room-name').value;
    const roomCapacity = document.getElementById('add-room-capacity').value;
    const roomAvailable = document.getElementById('add-room-available').value;

    // Dữ liệu cần gửi lên server
    const roomData = {
        name: roomName,
        capacity: parseInt(roomCapacity, 10),
        isAvailable: roomAvailable  
    }; 
            createRoom(roomData); 
        });
        
}

}

  