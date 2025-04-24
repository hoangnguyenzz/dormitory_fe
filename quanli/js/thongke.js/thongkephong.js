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
            <canvas id="roomStatusChart" width="300" height="300"></canvas> <!-- Biểu đồ hình tròn -->
        </div>

        <div class="stat-details">
            <div class="stat-item">
                <i class="fas fa-bed"></i> <!-- Icon phòng -->
                <span id="activeRooms">0 Phòng Đang Hoạt Động</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-ban"></i> <!-- Icon không hoạt động -->
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

        // const data = {
        //     active: 40,
        //     inactive: 50
        // }

        const activeRooms = data.active || 0;
        const inactiveRooms = data.inactive || 0;

        const myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Đang hoạt động', 'Không hoạt động'],
                datasets: [{
                    data: [activeRooms, inactiveRooms],
                    backgroundColor: ['#4caf50', '#f44336'],
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
                                const total = activeRooms + inactiveRooms;
                                const value = context.parsed;
                                const percent = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${value} (${percent}%)`;
                            }
                        }
                    }
                }
            }
        });

        // Cập nhật số lượng phòng đang hoạt động và không hoạt động
        document.getElementById("activeRooms").textContent = `${activeRooms} Phòng Đang Hoạt Động`;
        document.getElementById("inactiveRooms").textContent = `${inactiveRooms} Phòng Không Hoạt Động`;

    } catch (error) {
        console.error("Lỗi khi load dữ liệu thống kê phòng:", error);
    }
}
