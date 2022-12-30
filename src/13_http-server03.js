/* eslint-disable prefer-template */
/* eslint-disable no-path-concat */
const http = require('http');
const fs = require('fs/promises'); // 使用 fs promise API

const server = http.createServer(async (req, res) => {
  console.log('--------', req.url);
  const result = await fs.readFile(
    __dirname + '/10_esm.html',
  );
  // result = read data

  res.end(`
    result: ${result}`);
  // 要將result變為字串，否則傳到前端會變成html，html <script>會讀取不到server端的module
  // -> 不要只放result
});

server.listen(3000);
