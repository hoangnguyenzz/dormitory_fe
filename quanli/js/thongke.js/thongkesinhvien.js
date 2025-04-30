
import { callApi } from "../../../apis/baseApi.js";

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

             
            <div class="chart-container">
                <canvas id="studentByRoomChart"></canvas>
            </div>

            <div class="chart-note">
                <p>🗓️ Biểu đồ hiển thị số lượng sinh viên đăng ký trong <b>2 tháng gần nhất</b>.</p>
            </div>
        </div>
    `;
}


// Hàm vẽ biểu đồ cột (dữ liệu ảo)
export async function thongKeSinhVienChart() {
    const ctx = document.getElementById("studentByRoomChart").getContext("2d");

    // Lấy thời gian hiện tại
    const now = new Date();
    const thisMonth = now.getMonth() + 1; // Tháng trong JS bắt đầu từ 0
    const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
    const year = now.getFullYear();

    // Format tên tháng (ví dụ: "Tháng 4")
    const formatMonth = (month) => `Tháng ${month}`;


    const data1 = await callApi(`/api/v1/users/statistics?month1=${lastMonth}&month2=${thisMonth}&year=${year}`, "GET", null, {
        "Authorization": `Bearer ${token}`
    });

    console.log("check :", data1);

    const data = [
        {
            month: formatMonth(lastMonth),
            studentCount: data1?.[0]?.month === lastMonth
                ? data1?.[0]?.total ?? 0
                : data1?.[1]?.total ?? 0
        },
        {
            month: formatMonth(thisMonth),
            studentCount: data1?.[1]?.month === thisMonth
                ? data1?.[1]?.total ?? 0
                : data1?.[0]?.total ?? 0
        }
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
                backgroundColor: ['#66bb6a', '#42a5f5'],
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
