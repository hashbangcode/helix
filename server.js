import http from 'node:http';
import url from 'node:url';
import fs from 'node:fs';

// Get the helix IP from the environment variables.
const helixIp = process.env.HELIXIP;

const apiFunctions = [
    '/getStatus',
    '/getFiles',
    '/playFile',
    '/Event',
    '/getTracks',
    '/playTrack',
    '/setVolume',
    '/pickZone',
    '/getGenericSettings',
];

const server = http.createServer((request, response) => {
    // Deconstruct the request url intp parts.
    let urlParts = url.parse(request.url);
    if (apiFunctions.includes(urlParts.pathname)) {
        // Proxy the API call to the Helix.
        let requestUrl = 'http://' + helixIp + request.url;
        http.get(requestUrl, res => {
            let data = [];
            res.on('data', chunk => {
                data.push(chunk);
            });
            res.on('end', () => {
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.end(Buffer.concat(data).toString());
            });
        });
    } else if (request.url === '/favicon.ico') {
        // Return the favicon.ico file.
        try {
            const data = fs.readFileSync('favicon.ico');
            response.statusCode = 200;
            response.setHeader('Content-Type', 'image/x-icon');
            response.end(data);
        } catch (err) {
            console.error(err);
        }
    } else {
        // Return the index.html page.
        try {
            const data = fs.readFileSync('index.html', 'utf8');
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/html');
            response.end(data);
        } catch (err) {
            console.error(err);
        }
    }
});

const hostname = '127.0.0.1';
const port = 8000;
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
