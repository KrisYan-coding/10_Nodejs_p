/* eslint-disable quotes */
require('dotenv').config();

// 1. require express
const express = require('express');

// 2. create web server 物件
const app = express();

// 3. 建立後端路由(routes)
app.get('/', (req, res) => {
  res.send(`<h2>你好嗎</h2>`);
});

// 4. server 監聽
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server started: ${port}`);
});
// --參數2 : 正常啟動後呼叫的 function
