// import 內建套件 'http' (不要打路徑)--
const http = require('http');

// 建立 server--
const server = http.createServer((req, res) => {
  // // 開啟server時，會進入pending狀態(類promise)，等待程序處理完，並回應給用戶端

  // // 設定回應的檔頭--
  res.writeHead(200, {
    'Content-Type': 'text/html',
  });

  // // 回應給用戶端，並結束--
  // res.end(`
  //     <h2>Hello</h2>
  //     <p>${ req.url }</p>`);

  const reqKey = req.url.slice(1).split('/');
  res.end(`
        <h2>Hello</h2>
        <p>${reqKey[0]}</p>`);
});

// 建立監聽port, 1024以下不要用--
server.listen(3000);

// node執行 js--
// 每次執行時，node 會將 js complie 成機器碼，儲存在記憶體
// 如果變更 js 內容，需要重新執行 js -> 重新 complie -> 重新在記憶體中儲存機器碼
// 才能看到變更的內容
// -> nodemon 可以解決此問題
// 監看 .js / .mjs / .json 專案裡的檔案，有變更時會重新啟動
