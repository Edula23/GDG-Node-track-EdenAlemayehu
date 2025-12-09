const http = require('http');
const server = http.createServer((req, res) => {
    if(req.url === "/" ){
        res.statusCode = 200;
        res.end("Welcome to the Home Page")
    }
    else if (req.url === "/info"){
        res.statusCode = 200;
        res.end("This is the information page")
    }
    else if (req.url === "/submit") {
        if (req.method !== "POST") {
            res.statusCode = 405;
            return res.end("Method Not Allowed");
        }

        let body = "";
        req.setEncoding("utf8");

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const data = body ? JSON.parse(body) : {};
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data));
            } catch (error) {
                res.statusCode = 400;
                res.end("Invalid JSON");
            }
        });
    }
    else{
        res.statusCode = 400;
        res.end("Page not found")
    }
}
)
server.listen(3000, () => {
    console.log("Server running on port 3000");
});