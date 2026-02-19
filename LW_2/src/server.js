const http = require('http');
const {PORT} = require('./config/env');

const server = http.createServer((req, res) => {
    res.end('Server works');
});

server.listen(PORT, () => {
    console.log(`Server is runnig at http://localhost:${PORT}`);
});
