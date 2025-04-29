import { callApi } from "../../../apis/baseApi.js";

export function thongKeHoaDon() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/quanli/css/thongkehoadon.css";
    document.head.appendChild(link);

    return `
        <div class="bill-statistics-wrapper">
            <h2 class="stat-title">📊 Thống kê hóa đơn theo trạng thái</h2>

            <label for="roomSelect">Chọn phòng:</label>
            <select id="roomSelect" class="room-select">
                <option value="">Đang tải...</option>
            </select>

            <div class="chart-container">
                <canvas id="billChart"></canvas>
            </div>

            <div class="chart-note">
                💡 Biểu đồ thể hiện tổng tiền <b>Đã đóng</b> và <b>Chưa đóng</b> cho mỗi tháng.
            </div>

            <div class="status-legend">
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #66bb6a;"></div>
                    <span>Đã đóng</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #ef5350;"></div>
                    <span>Chưa đóng</span>
                </div>
            </div>
        </div>
    `;
}

export async function thongKeHoaDonChart() {
    const token = localStorage.getItem("token");
    const ctx = document.getElementById("billChart").getContext("2d");
    const select = document.getElementById("roomSelect");
    let chart;

    // Gọi API danh sách phòng
    const rooms = await callApi("/api/v1/rooms", "GET", null, {
        "Authorization": `Bearer ${token}`
    });

    select.innerHTML = ""; // Xoá option "Đang tải..."
    rooms.result.forEach((room, index) => {
        const option = document.createElement("option");
        option.value = room.id;
        option.textContent = `Phòng ${room.name}`;
        if (index === 0) option.selected = true; // Chọn phòng đầu tiên
        select.appendChild(option);
    });

    // Vẽ biểu đồ
    async function renderChart(roomId) {
        if (!roomId) return;

        const year = new Date().getFullYear();
        const roomData = await callApi(`/api/v1/hoadon/statistics?roomId=${roomId}&year=${year}`, "GET", null, {
            "Authorization": `Bearer ${token}`
        });

        if (!roomData || roomData.length === 0) {
            alert("Không có dữ liệu hóa đơn cho phòng này.");
            return;
        }

        const months = roomData.map(item => `Tháng ${item.month}`);
        const tongTienData = roomData.map(item => item.tongTien);
        const colors = roomData.map(item => item.trangThai === "0" ? "#ef5350" : "#66bb6a");

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: months,
                datasets: [{
                    label: "Tổng tiền (VND)",
                    data: tongTienData,
                    backgroundColor: colors,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Hóa đơn của phòng`
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.raw.toLocaleString()} VND`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Tổng tiền (VND)"
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Tháng"
                        }
                    }
                }
            }
        });
    }

    // Gọi biểu đồ lần đầu với phòng đầu tiên
    if (rooms.result.length > 0) {
        renderChart(rooms.result[0].id);
    }

    // Lắng nghe khi người dùng chọn phòng khác
    select.addEventListener("change", (e) => {
        renderChart(e.target.value);
    });
}
