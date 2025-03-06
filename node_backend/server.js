const Hapi = require('@hapi/hapi');

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

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: true // Enables CORS globally
        }
    });

 
    server.route({
        method: 'GET',
        path: '/employees',
        handler: (request, h) => {
            return employees;
        }
    });


    server.route({
        method: 'POST',
        path: '/employees',
        handler: (request, h) => {
            const newEmployee = request.payload;
            newEmployee.id = String(employees.length + 1);
            employees.push(newEmployee);
            return h.response(newEmployee).code(201);
        }
    });

   
    server.route({
        method: 'GET',
        path: '/employees/{id}',
        handler: (request, h) => {
            const employee = employees.find(emp => emp.id === request.params.id);
            if (employee) {
                return employee;
            } else {
                return h.response({ message: "Employee not found" }).code(404);
            }
        }
    });

    // Update employee by ID
    server.route({
        method: 'PUT',
        path: '/employees/{id}',
        handler: (request, h) => {
            const { id } = request.params;
            const updatedData = request.payload;
            const index = employees.findIndex(emp => emp.id === id);

            if (index !== -1) {
                employees[index] = { ...employees[index], ...updatedData };
                return employees[index];
            } else {
                return h.response({ message: "Employee not found" }).code(404);
            }
        }
    });

    // Delete employee by ID
    server.route({
        method: 'DELETE',
        path: '/employees/{id}',
        handler: (request, h) => {
            const { id } = request.params;
            const index = employees.findIndex(emp => emp.id === id);

            if (index !== -1) {
                employees.splice(index, 1);
                return { message: "Employee deleted successfully" };
            } else {
                return h.response({ message: "Employee not found" }).code(404);
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};


init();
