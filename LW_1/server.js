const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
    const method = req.method;
    const url = req.url;

    console.log(`${new Date().toISOString()} ${method} ${url}`);

    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8"});
    res.end(`You made a ${method} request to ${url}`);
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


