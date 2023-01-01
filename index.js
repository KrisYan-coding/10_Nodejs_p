/* eslint-disable quotes */
require('dotenv').config();

// 1. require express
// =====================================================================
const express = require('express');

// 2. create web server 物件
// =====================================================================
const app = express();

// 註冊樣板引擎 (預設為專案底層 views 資料夾，改資料夾要另外設定)--
app.set('view engine', 'ejs');
// --app.set() : configure the behavior of the server

// 3. 建立後端路由(routes)，有先後順序
// =====================================================================
// 當用 get 訪問 '/' 時，就執行 callback function--
// app.get('/', (req, res) => {
//   res.send(`<h2>你好嗎</h2>`);
//   // --res.send() 不要放數值
// });

app.get('/', (req, res) => {
  res.render('main', { name: '顏瑜君' });
  // --因為已註冊樣板引擎在 views，所以直接打檔名
  // --res.render() 呈現樣板 main 到前端，並給變數值
  // --template 檔名前面不要加 '/'
});

// app.use('/a.html', (req, res) => {
//   res.send(`<h2>假的a.html</h2>`);
// });

// 建立可以訪問'piblic'資料夾中的靜態內容的路由--
// 只能用 get
app.use(express.static('public'));

// ****所有路由要放在最後一道防線之前****
// 建立最後一道防線--
// app.use : 所有 http 的 method 都可以攔截，不設定路徑可攔截所有路徑--
app.use((req, res) => {
  res.type('text/html'); // res的檔頭 Content-Type

  // res.status(404);
  // res.send(`<h2>找不到你要的頁面yo</h2>`);
  // --shorten--
  res.status(404).send(`<h2>找不到你要的頁面yo</h2>`);
});

// 4. server 監聽
// =====================================================================
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server started: ${port}`);
});
// --參數2 : 正常啟動後呼叫的 function
