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

// 3. 建立後端路由(routes)，有先後順序，路徑都要加'/'
// =====================================================================
// 當用 get 訪問 '/' 時，就執行 callback function--
// app.get('/', (req, res) => {
//   res.send(`<h2>你好嗎</h2>`);
//   // --res.send() 不要放數值
// });

// 回應 template main--
app.get('/', (req, res) => {
  res.render('main', { name: '顏瑜君' });
  // --因為已註冊樣板引擎在 views，所以直接打檔名
  // --res.render() 呈現樣板 main 到前端，並給變數值
  // --template 檔名前面不要加 '/'
});

// 回應 json--
app.get('/json-sales', (req, res) => {
  const data = require(__dirname + '/data/sales.json');
  // --require json 檔，會自動做 JSON.parse() 轉換為原生類型
  // --若變更 json 檔內容，server要重新啟動(用nodemon每次存檔就會重新啟動)，才會重新require，前端才會更新
  // --CJS require可以在檔案的任何地方；ESM import 只能在檔案最上方

  // res.json(data);
  // data 轉換為json字串，送給client，並設定 res Header/Content-Type: application/json

  const orderBy = req.query.orderBy || 'id';
  console.log(orderBy);
  let dataSorted = data.sort((a, b) => {
    return (a[orderBy] > b[orderBy]) ? 1 : -1;
  });
  res.render('json-sales', {dataSorted});
});

// 回應排序資料 meth1--
// app.get('/json-sales2', (req, res) => {
//   const data = require(__dirname + '/data/sales.json');

//   const {orderby} = req.query;
//   // --req.query 已將 query string 轉為物件

//   const handleObj = {
//     name_asc: {
//       label : '姓名由小到大',
//       sort : (a, b) => {

//       },
//       selected : false
//     },
//     name_desc: {
//       label : '姓名由大到小',
//       sort : (a, b) => {

//       },
//       selected : false
//     },
//     age_asc: {
//       label : '年齡由小到大',
//       sort : (a, b) => {

//       },
//       selected : false
//     },
//     age_desc: {
//       label : '年齡由大到小',
//       sort : (a, b) => {

//       },
//       selected : false
//     }
//   };

//   if (orderby){
//     handleObj[orderby].selected = true;
//   }

//   res.render('json-sales2', {data, handleObj});
// });

// 回應排序資料 meth2--
app.get('/json-sales2', (req, res) => {
  const data = require(__dirname + '/data/sales.json');

  const {orderby} = req.query;
  // --req.query 已將 query string 轉為物件

  const handleObj = {
    name_asc: {
      label : '姓名由小到大',
      sort : (a, b) => (a.name > b.name ? 1 : -1)
    },
    name_desc: {
      label : '姓名由大到小',
      sort : (a, b) => (a.name > b.name ? -1 : 1)
    },
    age_asc: {
      label : '年齡由小到大',
      sort : (a, b) => (a.age - b.age)
    },
    age_desc: {
      label : '年齡由大到小',
      sort : (a, b) => (b.age - a.age)
    }
  };

  // query string 有對應到 才排序--
  if (handleObj[orderby]){
    data.sort(handleObj[orderby].sort);
  }

  res.render('json-sales2', {data, handleObj, orderby});
});

app.get('/try-qs', (req, res) => {
  console.log(req.query);
  // --req.query 將 query string 轉為物件

  // 把client req 的 query string 在傳回去給 client--
  res.json(req.query);
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
