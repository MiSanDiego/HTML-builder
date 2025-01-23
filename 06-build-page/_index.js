const http = require('node:http');
// const fs = require('node:fs/promises');
const fs = require('node:fs');

const superHero = {
  name: 'Mike',
  occupation: 'Minha area',
}
// readHtmlContent();

const server = http.createServer((req, resp) => {
  resp.writeHead(200, { 'Content-Type': 'text/html' });
  fs.createReadStream('./index.html').pipe(resp);
  // resp.end(html);
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});


async function readHtmlContent() {
  const html = await fs.readFile('./index.html', 'utf-8');

  const server = http.createServer((req, resp) => {
    resp.writeHead(200, { 'Content-Type': 'text/html' });
    // resp.writeHead(200, { 'Content-Type': 'text/plain' });
    // resp.writeHead(200, { 'Content-Type': 'application/json' });
    // resp.end(JSON.stringify(superHero));
    // resp.end(JSON.stringify(superHero));
    resp.end(html);
  });
  
  server.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}
