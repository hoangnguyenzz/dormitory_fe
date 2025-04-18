export function showToast(message, type = "info") {
    let bgColor = "#333";

    switch (type) {
        case "success":
            bgColor = "#28a745"; // xanh lá
            break;
        case "error":
            bgColor = "#dc3545"; // đỏ
            break;
        case "warning":
            bgColor = "#ffc107"; // vàng
            break;
        case "info":
        default:
            bgColor = "#17a2b8"; // xanh dương nhạt
            break;
    }

    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: bgColor,
        close: true,
        stopOnFocus: true,
    }).showToast();
}
