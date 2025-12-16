import express from "express";
const app = express();
const PORT = 3000;

app.get('/home', (req, res) => {
    res.send('<h1 style="color: green;">Welcome to the Home Page</h1> ');
}
)
app.get('/about', (req, res) => {
    res.send('<h1 style="color: green;">Welcome to the About Page</h1> ');
}
)
app.get('/students/:studentId', (req, res) => {
    const studentId = req.params.studentId;

    const student = {
        id: studentId,
        name: 'Abebe',
        email: `abebe${studentId}@example.com`,
        department: 'Software',
    }
    res.json(student);
});
app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}/`);
});