const http = require("http");

const PORT = 4000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8"});
    res.end("Hello, Server! Made by Natan Nedaikhlib.");
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


