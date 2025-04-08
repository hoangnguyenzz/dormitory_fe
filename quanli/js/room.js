

export function listRoomPage() {
    return `
    <div class="table-container">
        <table id="room-table">
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Tên phòng</th>
                    <th>Số người ở</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody id="room-table-body">
                <!-- Dữ liệu sẽ được render bằng JS -->
            </tbody>
        </table>
    </div>
    <div class="pagination" id="room-pagination"></div>
    `;
}
export function listRoomPageTest() {
    console.log("Room table found!11");
    const roomtable = document.getElementById("room-table");
    if (roomtable) {
        console.log("Room table found!");
        const rooms = [
            { name: "Phòng A101", count: 3, status: "Đang ở" },
            { name: "Phòng A102", count: 2, status: "Trống" },
            { name: "Phòng B201", count: 4, status: "Đang ở" },
            { name: "Phòng C301", count: 0, status: "Trống" },
            { name: "Phòng D401", count: 1, status: "Đang ở" },
            { name: "Phòng E501", count: 2, status: "Đang ở" },
            { name: "Phòng F601", count: 0, status: "Trống" },
            { name: "Phòng G701", count: 3, status: "Đang ở" },
        ];


        const rowsPerPage = 5;
        let currentPage = 1;

        function renderTable() {
            const start = (currentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            const currentRooms = rooms.slice(start, end);

            const tbody = document.getElementById("room-table-body");
            tbody.innerHTML = currentRooms.map((room, index) => `
                <tr>
                    <td>${start + index + 1}</td>
                    <td>${room.name}</td>
                    <td>${room.count}</td>
                    <td>${room.status}</td>
                </tr>
            `).join("");
        }

        function renderPagination() {
            const pageCount = Math.ceil(rooms.length / rowsPerPage);
            const pagination = document.getElementById("room-pagination");
            pagination.innerHTML = "";

            for (let i = 1; i <= pageCount; i++) {
                const btn = document.createElement("button");
                btn.textContent = i;
                if (i === currentPage) btn.classList.add("active");
                btn.addEventListener("click", () => {
                    currentPage = i;
                    renderTable();
                    renderPagination();
                });
                pagination.appendChild(btn);
            }
        }

        renderTable();
        renderPagination();

    }
}