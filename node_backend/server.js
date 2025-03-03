const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let employees = [
    {
        id: "1",
        name: "John",
        department: "",
        email: "saravana.kumar@provility.com",
        contact: "1234567890",
        address: "ww",
        salary: "11"
    },
    {
        id: "2",
        name: "sdc",
        department: "Developer",
        email: "krishnan@provility.com",
        contact: "1234567123",
        address: "krish",
        salary: "11"
    }
];


app.get("/employees", (req, res) => {
    res.json(employees);
});

app.post("/employees", (req, res) => {
    const newEmployee = req.body;
    newEmployee.id = String(employees.length + 1); // Auto-generate ID
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
});

app.get("/employees/:id", (req, res) => {
    const employee = employees.find(emp => emp.id === req.params.id);
    if (employee) {
        res.json(employee);
    } else {
        res.status(404).json({ message: "Employee not found" });
    }
});

app.put("/employees/:id", (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    const value =employees
    const index = employees.findIndex(emp => emp.id === id);

    if (index !== -1) {
        employees[index] = { ...employees[index], ...updatedData };
        res.json(employees[index]);
    } else {
        res.status(404).json({ message: "Employee not found" });
    }
});


app.delete("/employees/:id", (req, res) => {
    const { id } = req.params;
    const index = employees.findIndex(emp => emp.id === id);

    if (index !== -1) {
        employees.splice(index, 1);
        res.json({ message: "Employee deleted successfully" });
    } else {
        res.status(404).json({ message: "Employee not found" });
    }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
