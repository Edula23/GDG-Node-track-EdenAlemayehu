const http = require('http');
let students = [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Charlie Brown" }
];
function parseURL(url) {
    const urlParts = url.split('/');
    const id = urlParts[2] ? parseInt(urlParts[2]) : null;
    return { id };
}

const server = http.createServer((req, res) => {
    const { method, url } = req;    
    const urlInfo = parseURL(url);
    
    if (method === 'GET' && url === '/students') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(students));
        
    } else if (method === 'POST' && url === '/students') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const studentData = JSON.parse(body);
                
                if (!studentData.name || typeof studentData.name !== 'string') {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ 
                        error: "Student name is required and must be a string" 
                    }));
                }
                
                const newId = students.length > 0 
                    ? Math.max(...students.map(s => s.id)) + 1 
                    : 1;
                const newStudent = {
                    id: newId,
                    name: studentData.name.trim()
                };
                
                students.push(newStudent);
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newStudent));
                
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON data' }));
            }
        });
        
    } else if (method === 'PUT' && url.startsWith('/students/') && urlInfo.id) {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const updateData = JSON.parse(body);
                
                if (!updateData.name || typeof updateData.name !== 'string') {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ 
                        error: "Student name is required and must be a string" 
                    }));
                }
                
                const studentIndex = students.findIndex(s => s.id === urlInfo.id);
                
                if (studentIndex === -1) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ 
                        error: `Student with id ${urlInfo.id} not found` 
                    }));
                }
                
                students[studentIndex].name = updateData.name.trim();
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(students[studentIndex]));
                
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON data' }));
            }
        });
        
    } else if (method === 'DELETE' && url.startsWith('/students/') && urlInfo.id) {
        const studentIndex = students.findIndex(s => s.id === urlInfo.id);
        
        if (studentIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ 
                error: `Student with id ${urlInfo.id} not found` 
            }));
        }
        
        const deletedStudent = students[studentIndex];
        students.splice(studentIndex, 1);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            message: `Student '${deletedStudent.name}' (ID: ${deletedStudent.id}) deleted successfully` 
        }));
        
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Student REST API running at http://localhost:${PORT}`);
    console.log(students);
});