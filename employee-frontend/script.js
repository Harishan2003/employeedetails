console.log("script.js loaded");

const API = "http://localhost:8080/api/employees";

/* =======================================================
   LOGIN
======================================================= */
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("online", "1");
            window.location = "dashboard.html";
        } else {
            document.getElementById("message").innerText = "Invalid login!";
        }
    });
}

/* =======================================================
   DASHBOARD — LOAD EMPLOYEES AND CARDS
======================================================= */
function loadEmployees() {
    fetch(API)
        .then(res => res.json())
        .then(data => {
            let table = `
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Dept</th>
                    <th>Salary</th>
                    <th>Action</th>
                </tr>
            `;
            data.forEach(emp => {
                table += `
                    <tr>
                        <td>${emp.id}</td>
                        <td>${emp.name}</td>
                        <td>${emp.department}</td>
                        <td>${emp.salary}</td>
                        <td>
                            <button onclick="goToUpdate(${emp.id})">✏ Update</button>
                            <button onclick="goToDelete(${emp.id})">🗑 Delete</button>
                        </td>
                    </tr>`;
            });
            document.getElementById("employeeTable").innerHTML = table;

            // Update dashboard cards
            document.getElementById("cardTotal").innerHTML =
                `Total Employees<br><b>${data.length}</b>`;
            document.getElementById("cardDept").innerHTML =
                `Departments<br><b>${new Set(data.map(e => e.department)).size}</b>`;
            document.getElementById("cardOnline").innerHTML =
                `Online Now<br><b>${localStorage.getItem("online") ? 1 : 0}</b>`;
        });
}

/* =======================================================
   SEARCH EMPLOYEE
======================================================= */
function searchEmployee() {
    let input = document.getElementById("search").value.toLowerCase();
    document.querySelectorAll("#employeeTable tr").forEach((row, i) => {
        if (i === 0) return;
        row.style.display = row.innerText.toLowerCase().includes(input) ? "" : "none";
    });
}

/* =======================================================
   CREATE / UPDATE / DELETE EMPLOYEE
======================================================= */
function createEmployee() {
    let employee = {
        name: document.getElementById("name").value,
        department: document.getElementById("department").value,
        salary: document.getElementById("salary").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };
    fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee)
    }).then(() => { window.location = "dashboard.html"; });
}

function goToUpdate(id) { window.location = `update.html?id=${id}`; }

function loadEmployeeForUpdate() {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return;
    fetch(`${API}/${id}`)
        .then(res => res.json())
        .then(emp => {
            document.getElementById("id").value = emp.id;
            document.getElementById("name").value = emp.name;
            document.getElementById("department").value = emp.department;
            document.getElementById("salary").value = emp.salary;
        });
}

function updateEmployee() {
    let id = document.getElementById("id").value;
    let employee = {
        name: document.getElementById("name").value,
        department: document.getElementById("department").value,
        salary: document.getElementById("salary").value
    };
    fetch(`${API}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(employee) })
        .then(() => { window.location = "dashboard.html"; });
}

function goToDelete(id) {
    if (!confirm("Are you sure?")) return;
    fetch(`${API}/${id}`, { method: "DELETE" })
        .then(() => { loadEmployees(); });
}

function logout() { localStorage.removeItem("online"); window.location = "index.html"; }

/* =======================================================
   ATTENDANCE TABLE
======================================================= */
function loadAttendancePage() {
    const date = document.getElementById("attDate").value;
    fetch(API).then(res => res.json()).then(employees => {
        fetch(`http://localhost:8080/api/attendance/full?date=${date}`).then(res => res.json()).then(attData => {

            let table = `<tr>
                <th>ID</th>
                <th>Name</th>
                <th>Dept</th>
                <th>Status</th>
                <th>Action</th>
            </tr>`;

            employees.forEach(emp => {
                const att = attData.find(a => a.id === emp.id || a.employeeId === emp.id);
                const status = att ? att.status : "Absent";

                table += `<tr>
                    <td>${emp.id}</td>
                    <td>${emp.name}</td>
                    <td>${emp.department}</td>
                    <td style="color:${status==='Present'?'green':'red'}">${status}</td>
                    <td>
                        <button onclick="markAttendance(${emp.id}, 'Present')">Mark Present</button>
                        <button onclick="markAttendance(${emp.id}, 'Absent')">Mark Absent</button>
                    </td>
                </tr>`;
            });

            document.getElementById("attendanceTable").innerHTML = table;
        });
    });
}

/* =======================================================
   MARK ATTENDANCE
======================================================= */
function markAttendance(empId, newStatus) {
    const date = document.getElementById("attDate").value;
    fetch("http://localhost:8080/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: empId, date: date, status: newStatus })
    }).then(() => loadAttendancePage());
}

/* =======================================================
   EXPORT CSV (exclude Action column)
======================================================= */
function downloadAttendanceCSV() {
    const rows = document.querySelectorAll("#attendanceTable tr");
    const csv = [...rows].map((row,i) => {
        const cols = [...row.querySelectorAll("td, th")].map(c => c.innerText.trim());
        return i===0 ? cols.slice(0,4).join(",") : cols.slice(0,4).join(","); // only first 4 columns
    }).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_${document.getElementById("attDate").value}.csv`;
    link.click();
}

/* =======================================================
   EXPORT PDF (black font, exclude Action column)
======================================================= */
async function downloadAttendancePDF() {
    const tableArea = document.querySelector(".table-container");
    const dateStr = document.getElementById("attDate").value;

    // Clone table and remove action column
    const clone = tableArea.cloneNode(true);
    clone.querySelectorAll('th:last-child, td:last-child').forEach(el => el.remove());
    clone.style.background = "#fff";
    clone.querySelectorAll('*').forEach(el => el.style.color = 'black');

    document.body.appendChild(clone); // temporary for canvas
    const canvas = await html2canvas(clone, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    document.body.removeChild(clone);

    const pdf = new jspdf.jsPDF("p","mm","a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.setFontSize(18);
    pdf.setTextColor(0,0,0);
    pdf.text(`Attendance Report - ${dateStr}`, 10, 15);
    pdf.addImage(imgData,"PNG",10,25,width-20,height);
    pdf.save(`attendance_${dateStr}.pdf`);
}

/* =======================================================
   THEME TOGGLE (dashboard only)
======================================================= */
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

/* =======================================================
   INIT
======================================================= */
document.addEventListener("DOMContentLoaded", () => {
    if(document.getElementById("attDate")){
        document.getElementById("attDate").value = new Date().toISOString().slice(0,10);
        loadAttendancePage();
        document.getElementById("attDate").addEventListener("change", loadAttendancePage);
    }
    if(document.getElementById("employeeTable")){
        loadEmployees();
    }
});
