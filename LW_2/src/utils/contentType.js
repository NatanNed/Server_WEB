const path = require('path');

function getContentType(filename) {
    const ext = path.extname(filename).toLowerCase();

    switch (ext) {
        case '.html':
            return 'text/html; charset=utf-8';
        case '.css':
            return 'text/css; charset=utf-8';
        case '.js':
            return 'application/javascript; charset=utf-8';
        case '.json':
            return 'application/json; charset=utf-8';

        // Images
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.gif':
            return 'image/gif';
         case '.svg':
            return 'image/svg+xml';
        case '.webp':
            return 'image/webp';
        case '.ico':
            return 'image/x-icon';

        default:
            return 'application/octet-stream';
    }
}

module.exports = { getContentType };