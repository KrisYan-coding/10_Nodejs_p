const http = require('http');

const server = http.createServer((req, res) => {
  console.log(process.argv);
  // --執行 server 程式時，要給定參數
  const data = process.argv;
  const name = data[2];
  const age = data[3];

  res.end(`Hello ${name}, you are ${age}.`);
});

server.listen(3000);
