/* eslint-disable prefer-template */
/* eslint-disable no-path-concat */
const http = require('http');
const fs = require('fs/promises'); // 使用 fs promise API

const server = http.createServer(async (req, res) => {
  console.log('-------------', req.url);
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });

  const result = await fs.readFile(
    __dirname + '/try-readfile.txt',
  );
  // result = read data

  res.end(result);
});

server.listen(3000);
