/* eslint-disable quotes */
require('dotenv').config();

// 1. require express
const express = require('express');

// 2. create web server 物件
const app = express();

// 3. 建立後端路由(routes)，有先後順序
// 當用 get 訪問 '/' 時，就執行 callback function--
app.get('/', (req, res) => {
  res.send(`<h2>你好嗎</h2>`);
  // --res.send() 不要放數值
});

// 建立可以訪問'piblic'資料夾中的靜態內容的路由--
app.use(express.static('public'));

// ****所有路由要放在最後一道防線之前****
// 建立最後一道防線，用 app.use ， 所有 http 的 method 都可以攔截，不設定路徑可攔截所有路徑--
app.use((req, res) => {
  res.type('text/html'); // res的檔頭 Content-Type

  // res.status(404);
  // res.send(`<h2>找不到你要的頁面yo</h2>`);
  // --shorten--
  res.status(404).send(`<h2>找不到你要的頁面yo</h2>`);
});

// 4. server 監聽
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server started: ${port}`);
});
// --參數2 : 正常啟動後呼叫的 function
