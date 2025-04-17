
import { callApi } from "../../../api/baseApi.js";

const token = localStorage.getItem("token");

// Giao diện chính của thống kê sinh viên
export function thongKeSinhVien() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/quanli/css/thongkesinhvien.css";
    document.head.appendChild(link);

    return `
        <div class="student-statistics-wrapper">
            <h2 class="stat-title">📊 Thống kê sinh viên theo tháng</h2>
            <canvas id="studentByRoomChart"></canvas>
        </div>
    `;
}

// Hàm vẽ biểu đồ cột (dữ liệu ảo)
export async function thongKeSinhVienChart() {
    const ctx = document.getElementById("studentByRoomChart").getContext("2d");

    // Dữ liệu test - thay sau bằng API
    const data = [
        { month: "Tháng 3", studentCount: 120 },
        { month: "Tháng 4", studentCount: 95 }
    ];

    const monthLabels = data.map(item => item.month);
    const studentCounts = data.map(item => item.studentCount);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Số sinh viên đăng ký',
                data: studentCounts,
                backgroundColor: ['#42a5f5', '#66bb6a'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Số sinh viên'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tháng'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.raw} sinh viên`
                    }
                }
            }
        }
    });
}
