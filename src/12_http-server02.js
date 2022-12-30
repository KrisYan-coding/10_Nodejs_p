/* eslint-disable prefer-template */
/* eslint-disable no-path-concat */
const http = require('http');
const fs = require('fs/promises'); // 使用 fs promise API

const server = http.createServer(async (req, res) => {
  const result = await fs.writeFile(
    __dirname + '/header01.txt',
    JSON.stringify(req.headers, null, 4),
  );
  // result = callback function 的參數 = error

  res.end(`<h2>result: ${result}</h2>`);
});

server.listen(3000);
