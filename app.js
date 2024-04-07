const express = require('express');
const app = express();

app.use(express.json());

const data = require('./data/employees.json');

app.get('/api/employees', (req, res) => {
    if (req.query.page) {
        const page = req.query.page;
        const pageSize = 2;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return res.json(data.slice(start, end));
    }

    if (req.query.user === 'true') {
        return res.json(data.filter(employee => employee.privileges === 'user'));
    }

    if (req.query.badges === 'black') {
        return res.json(data.filter(employee => employee.badges.includes('black')));
    }

    res.json(data);
});

app.get('/api/employees/oldest', (req, res) => {
    const oldest = data.reduce((prev, current) => {
        return (prev.age > current.age) ? prev : current;
    });

    res.json(oldest);
});

app.post('/api/employees', (req, res) => {
    const newEmployee = req.body;
    if (!newEmployee.name || !newEmployee.age || !newEmployee.phone || !newEmployee.privileges || !newEmployee.favorites || !newEmployee.finished || !newEmployee.badges || !newEmployee.points) {
        res.status(400).send({ code: 'bad_request' });
        return;
    }
    data.push(newEmployee);
    res.json(newEmployee);
});

app.get('/api/employees/:name', (req, res) => {
    const employee = data.find(emp => emp.name === req.params.name);
    if (!employee) {
        return res.status(404).json({ code: 'not_found' });
    }
    res.json(employee);
});

app.listen(8000, () => {
    console.log('Server started');
});