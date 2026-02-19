const http = require('http');
const fs = require('fs');
const path = require('path');


const { PORT, PUBLIC_DIR } = require('./config/env');
const { getContentType } = require('./utils/contentType');
const logger = require('./utils/logger');

const server = http.createServer((req, res) => {
    
    let filePath;

    if(req.url === '/') {
        filePath = path.join(PUBLIC_DIR, 'index.html');
    } else if(req.url === '/about') {
        filePath = path.join(PUBLIC_DIR, 'about.html');
    } else if(req.url === '/style') {
        filePath = path.join(PUBLIC_DIR, 'style.css');
    } else {
        filePath = path.join(PUBLIC_DIR, req.url);
    }

    fs.readFile(filePath, (err,content) => {

        if (err) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Not found');
            return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', getContentType(filePath));
        res.end(content);
    });

    const start = Date.now();
    res.on('finish', () => {
        const durationMs = Date.now() - start;
        
        logger.log(req.method, req.url, res.statusCode);
        console.log(`${req.method} ${req.url} ${res.statusCode} ${durationMs}ms`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is runnig at http://localhost:${PORT}`);
});
