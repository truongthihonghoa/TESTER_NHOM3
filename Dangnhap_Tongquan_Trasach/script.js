// =========================
//  DUE LIBRARY JS
// =========================

// ====== AUTH NAVIGATION LOGIC ======
function showModal(modalId) {
    // Hide all forms within auth page
    const forms = document.querySelectorAll('.auth-form-container');
    forms.forEach((form) => form.classList.remove('active'));

    // Show auth page and hide dashboard
    const authPage = document.getElementById('authPage');
    if (authPage) authPage.classList.add('active');
    const dashboard = document.getElementById('dashboardPage');
    if (dashboard) dashboard.classList.add('hidden');

    // Show target modal
    const targetForm = document.getElementById(modalId);
    if (targetForm) targetForm.classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();

    // Kiểm tra login (ở đây giả sử luôn đúng)
    // Sau khi đăng nhập thành công, chuyển sang trang Tongquan.html
    window.location.href = 'Tongquan.html';
}

// ====== NAVIGATION LOGIC ======
// function switchPage(page) {
//     // Hide all pages
//     const pages = ['overview', 'return'];
//     pages.forEach(p => document.getElementById(`page-${p}`).classList.add('hidden'));

//     // Deactivate all nav links
//     pages.forEach(p => document.getElementById(`nav-${p}`).classList.remove('active'));

//     // Show selected page
//     if (page === 'overview') {
//         document.getElementById('page-overview').classList.remove('hidden');
//         document.getElementById('nav-overview').classList.add('active');
//         document.getElementById('pageTitle').innerText = 'Tổng quan';
//     } else if (page === 'return') {
//         document.getElementById('page-return').classList.remove('hidden');
//         document.getElementById('nav-return').classList.add('active');
//         document.getElementById('pageTitle').innerText = 'Quản lý trả sách';
//     }
// }
function goToPage(page) {
    switch(page) {
        case 'logout':
            window.location.href = 'Dangnhap.html';
            break;

        case 'overview':
            window.location.href = 'Tongquan.html';
            break;

        case 'return':
            window.location.href = 'Trasach.html';
            break;

        case 'manage-books':
            window.location.href = '../Quan_ly_sach/quanlisach.html';
            break;
    }
}
// ====== TABS LOGIC ======
function switchTab(clickedTab, targetId) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    const panes = document.querySelectorAll('.tab-pane');
    panes.forEach(pane => pane.classList.add('hidden'));

    // Reset all table rows
    panes.forEach(pane => {
        pane.querySelectorAll('tbody tr').forEach(row => row.style.display = '');
    });

    // Activate clicked tab and show pane
    clickedTab.classList.add('active');
    document.getElementById(targetId).classList.remove('hidden');
}

// ====== SEARCH LOGIC ======
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    const query = searchInput.value.toLowerCase().trim();

    const activePane = document.querySelector('.tab-pane.active');
    if (!activePane) return;

    let matchCount = 0;
    activePane.querySelectorAll('tbody tr').forEach(row => {
        const rowText = row.textContent.toLowerCase();
        if (rowText.includes(query)) {
            row.style.display = '';
            matchCount++;
        } else {
            row.style.display = 'none';
        }
    });

    if (query !== '') {
        if (matchCount > 0) showToast('success', `Tìm thấy ${matchCount} kết quả phù hợp.`);
        else showToast('error', `Không tìm thấy kết quả nào cho "${query}".`);
    }
}

function resetSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.querySelectorAll('tbody tr').forEach(row => row.style.display = '');
    });
}

// ====== ACTION POPUPS ======
let currentRowElement = null;

function openPopup(popupId, btnElement) {
    currentRowElement = btnElement ? btnElement.closest('tr') : null;

    const overlay = document.getElementById('popupOverlay');
    const modals = document.querySelectorAll('.popup-modal');

    modals.forEach(modal => modal.classList.remove('active'));
    overlay.classList.add('active');
    document.getElementById(popupId).classList.add('active');
}

function closePopup() {
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.remove('active');

    document.querySelectorAll('.popup-modal').forEach(modal => modal.classList.remove('active'));
}

function confirmAction(message) {
    if (currentRowElement) {
        currentRowElement.remove();
        currentRowElement = null;
    }
    showToast('success', message);
    closePopup();
}

// ====== TOAST NOTIFICATIONS ======
function showToast(type, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success'
        ? "<i class='bx bx-check-circle' style='font-size:20px'></i>"
        : "<i class='bx bx-x-circle' style='font-size:20px'></i>";

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// ====== CHARTS LOGIC ======
document.addEventListener('DOMContentLoaded', function () {
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#888';

    // 1. Book Status Bar Chart
    const ctxBooks = document.getElementById('booksStatusChart').getContext('2d');
    new Chart(ctxBooks, {
        type: 'bar',
        data: { labels: ['Trong kho', 'Đang mượn'], datasets: [{ data: [49, 3], backgroundColor: ['#2365c1', '#f44336'], borderRadius: 4, barThickness: 40 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: true } },
            scales: { y: { display: false, max: 60 }, x: { grid: { display: false, drawBorder: false }, ticks: { font: { size: 10 } } } },
            animation: {
                onComplete: function(animation) {
                    const chartInstance = animation.chart;
                    const ctx = chartInstance.ctx;
                    ctx.font = Chart.helpers.fontString(12, 'bold', Chart.defaults.font.family);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    chartInstance.data.datasets.forEach((dataset, i) => {
                        const meta = chartInstance.getDatasetMeta(i);
                        meta.data.forEach((bar, index) => {
                            const data = dataset.data[index];
                            if (data > 0) { ctx.fillStyle = '#333'; ctx.fillText(data, bar.x, bar.y - 5); }
                        });
                    });
                }
            }
        }
    });

    // 2. Readers Doughnut Chart
    const ctxReaders = document.getElementById('readersChart').getContext('2d');
    new Chart(ctxReaders, {
        type: 'doughnut',
        data: { labels: ['Hoạt động', 'Tạm khóa'], datasets: [{ data: [4, 0], backgroundColor: ['#2365c1', '#e0e0e0'], borderWidth: 0, cutout: '75%' }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } }
    });

    // 3. Overdue Line Chart
    const ctxOverdue = document.getElementById('overdueChart').getContext('2d');
    new Chart(ctxOverdue, {
        type: 'line',
        data: { labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'], datasets: [{ label: 'Số phiếu quá hạn', data: [0,0,0,0,1,0,0], borderColor: '#2365c1', backgroundColor: '#2365c1', borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#2365c1', fill: false, tension: 0.1 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 8, font: { size: 10 }, usePointStyle: true } } },
            scales: { y: { beginAtZero: true, max: 2, ticks: { stepSize: 1, font: { size: 10 } }, grid: { color: '#f0f0f0' } }, x: { grid: { display: false }, ticks: { font: { size: 10 } } } }
        }
    });
});