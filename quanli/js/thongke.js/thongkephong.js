import { callApi } from "../../../apis/baseApi.js";
const token = localStorage.getItem("token");

export function thongKePhong() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/quanli/css/thongkephong.css";
    document.head.appendChild(link);

    return `
    <div class="stat-container">
        <h3 class="stat-title">Thống kê phòng</h3>
        
        <div class="chart-container">
            <canvas id="roomStatusChart" width="300" height="300"></canvas>
        </div>

        <div class="stat-details">
            <div class="stat-item">
                <i class="fas fa-bed"></i>
                <span id="emptyRooms">0 Phòng Trống</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-play-circle"></i>
                <span id="activeRooms">0 Phòng Đang Hoạt Động</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-ban"></i>
                <span id="inactiveRooms">0 Phòng Không Hoạt Động</span>
            </div>
        </div>
    </div>
    `;
}


export async function thongKePhongChart() {
    const ctx = document.getElementById("roomStatusChart").getContext("2d");

    try {
        const data = await callApi("/api/v1/rooms/thongke", "GET", null, {
            "Authorization": `Bearer ${token}`
        });

        const emptyRooms = data.trong || 0;
        const activeRooms = data.danghoatdong || 0;
        const inactiveRooms = data.khonghoatdong || 0;

        const total = emptyRooms + activeRooms + inactiveRooms;

        const myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Phòng Trống', 'Đang hoạt động', 'Không hoạt động'],
                datasets: [{
                    data: [emptyRooms, activeRooms, inactiveRooms],
                    backgroundColor: ['#2196f3', '#4caf50', '#f44336'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const value = context.parsed;
                                const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${context.label}: ${value} (${percent}%)`;
                            }
                        }
                    }
                }
            }
        });

        // Cập nhật thông tin số lượng
        document.getElementById("emptyRooms").textContent = `${emptyRooms} Phòng Trống`;
        document.getElementById("activeRooms").textContent = `${activeRooms} Phòng Đang Hoạt Động`;
        document.getElementById("inactiveRooms").textContent = `${inactiveRooms} Phòng Không Hoạt Động`;

    } catch (error) {
        console.error("Lỗi khi load dữ liệu thống kê phòng:", error);
    }
}
