const apiUrl = "http://localhost:3000/employees";
let editingId = null;

// Show Employee Form
function showForm(id) {
  document.querySelector(".hidenForm").style.display = "block";
  document.querySelector(".head-table").style.display = "none";

  if (!id) {
    document.getElementById("empName").value = "";
    document.querySelector("select[name='department']").value = "HR";
    document.getElementById("email").value = "";
    document.getElementById("contact").value = "";
    document.getElementById("address").value = "";
    document.getElementById("salary").value = "";
    editingId = null;
  }

  document.getElementById("form-submit-btn").innerText = "Submit";
}

// Show Table and Hide Form
function showTable() {
  document.querySelector(".hidenForm").style.display = "none";
  document.querySelector(".head-table").style.display = "block";
}

// Load Employee Data
async function loadTableData() {
  const response = await fetch(apiUrl);
  const employees = await response.json();

  const tableBody = document.getElementById("employeeTableBody");
  if (!tableBody) {
    console.error("Table body element not found!");
    return;
  }

  tableBody.innerHTML = ""; // Clear table before updating

  if (employees.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8">No data available</td></tr>`;
    return;
  }

  employees.forEach((emp) => {
    let row = `<tr>
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td>${emp.email}</td>
            <td>${emp.contact}</td>
            <td>${emp.address}</td>
            <td>${emp.salary}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editTable(${emp.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTable(${emp.id})">Delete</button>
            </td>
        </tr>`;
    tableBody.innerHTML += row;
  });
}

// Add or Update Employee
async function retriveTable(event) {
  event.preventDefault();

  const empData = {
    id: editingId,
    name: document.getElementById("empName").value,
    department: document.querySelector("select[name='department']").value,
    email: document.getElementById("email").value,
    contact: document.getElementById("contact").value,
    address: document.getElementById("address").value,
    salary: document.getElementById("salary").value,
  };

  if (editingId) {
    console.log("Editing ID:", editingId);
    console.log("Sending Data:", empData);

    const putUrl = `http://localhost:3000/employees/${editingId}`;

    await fetch(putUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empData), // Convert to JSON string
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  } else {
    const response = await fetch(apiUrl);
    const data = await response.json();
    let nextId =
    data.length +1;
    empData.id = nextId;

    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empData),
    });
  }

  loadTableData();
  showTable();
}

// Edit Employee
async function editTable(id) {
  const response = await fetch(`${apiUrl}?id=${id}`);
  const emp = await response.json();

  document.getElementById("empName").value = emp[0].name;
  document.querySelector("select[name='department']").value = emp[0].department;
  document.getElementById("email").value = emp[0].email;
  document.getElementById("contact").value = emp[0].contact;
  document.getElementById("address").value = emp[0].address;
  document.getElementById("salary").value = emp[0].salary;

  editingId = id;
  document.getElementById("form-submit-btn").innerText = "Update";

  showForm(id);
}

// Delete Employee
async function deleteTable(id) {
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  loadTableData();
}

// Load Employee Data on Page Load
window.onload = loadTableData;
