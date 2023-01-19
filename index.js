/* eslint-disable quotes */
// 0. require modules
// =====================================================================

// ------[使用 .env(預設) 的環境變數]
// require('dotenv').config();

// ------[依照 cmd 指令，決定使用 dev.env 或 prod.env 的環境變數]
if (process.argv[2] === 'production'){
  // --npm start -> nodemon index.js production
  //                   0       1        2
  require('dotenv').config({
    path: __dirname + '/prod.env'
  });
} else {
  require('dotenv').config({
    path: __dirname + '/dev.env'
  });
}

// ------[multer 簡單版(只設暫存路徑)]
// const multer = require('multer');
// const upload = multer({dest: 'upload_temp/'});
// --dest: destination 上傳資料暫存的資料夾

// ------[multer 複雜版(fileFilter / storage)]
let upload = require('./modules/upload-img');
let uploadErr = require('./modules/upload-img-error');
const uploadVdo = require('./modules/upload-vdo');

// ------[express-session]
const session = require('express-session');

// ------[express-mysql-session 要在 express-session require 後才 require，要將 session 參數傳入]
const MysqlStore = require('express-mysql-session')(session);
// --得到 class MysqlStore

// ------[database]
const db = require('./modules/connect-mysql');
const sessionStore = new MysqlStore({}, db);
// --argv -first: 連線資料庫的帳號密碼，如果已經有建立 db 連線就給{}； -second: 已建立的 db 連線

// ------[moment-timezone]
const moment = require('moment-timezone');

// ------[bcrypt]
const bcrypt = require('bcryptjs');


// 1. require express
// =====================================================================
const express = require('express');

// 2. create web server 物件
// =====================================================================
const app = express();

// ------[註冊樣板引擎 (預設為專案底層 views 資料夾，改資料夾要另外設定)]--
app.set('view engine', 'ejs');
// --app.set() : configure the behavior of the server

// ------[建立 Top-level middleware (每個req都會經過 / 有順序的 / 當多個路由都需要此middleware時)]***1
// body-parser for urlencoded data--
app.use(express.urlencoded({extended: false}));
// body-parser for json data--
app.use(express.json());

// ------[設定 cors middleware]--
const corsOptions = {
  credentials: true,  // res "Access-Control-Allow-Credentials: true"
  origin: (origin, callback) => {
    console.log({origin}); // origin: 從哪裡來拜訪的(PD)，會設定給 res "Access-Control-Allow-Origin: origin"，發 fetch 才有
    callback(null, true);
    // --argv -first: error/null
    // 沒有設白名單，沒有設條件，任何 PDP 來的 req 都可以接受
  },
};
const cors = require('cors');
app.use(cors(corsOptions));
// --用 use 每一個 req 都會經過
// --如果要緊設定給特定的 route ，就放在該 route 的第二個參數

// ------[設定 session middleware]--
app.use(session({
  saveUninitialized: false, // session尚未初始化前是否要儲存
  resave: false, // 沒有變更內容時是否要強制回存
  secret: 'djnfjvjknfvjnienekkopjidkm', // 加密用的字串
  store: sessionStore, // session 要儲存到資料庫(session + db)，資料庫會自動生成一個 "sessions" 資料表
  cookie: {
    maxAge: 1200_000, // cookie 存活時間，毫秒
  }
}));

// ------[自訂 middleware]--
app.use((req, res, next) => {
  console.log('自訂 middleware');

  res.locals.title = process.env.SITE_TITLE || '***沒有設定***'; 
  // --回傳資料 title，在 template 裡面的全域變數
  // --在 res.locals 新增自訂變數/函式，在樣板中可使用

  // 樣板輔助函式, helper functions
  res.locals.toDateString = d => moment(d).format('YYYY-MM-DD');
  res.locals.toDatetimeString = d => moment(d).format('YYYY-MM-DD HH:mm:ss');

  // 傳 req.session 給 template
  res.locals.session = req.session;
  
  next(); // 要加 next() 才可以往下進到路由，否則會卡住
});


// 3. 建立後端路由(routes)，有先後順序，路徑都要加'/'
// =====================================================================
// 當用 get 訪問 '/' 時，就執行 callback function--
// app.get('/', (req, res) => {
//   res.send(`<h2>你好嗎</h2>`);
//   // --res.send() 不要放數值
// });


// ----------[回應 template main]
app.get(['/', '/Home'], (req, res) => {
// --路由路徑可以用 array 包多個，只要符合其中一個就會進來
  res.render('main', { name: '顏瑜君' });
  // --因為已註冊樣板引擎在 views，所以直接打檔名
  // --res.render() 呈現樣板 main 到前端，並給變數值
  // --template 檔名前面不要加 '/'
  // --傳資料要包成物件
});


// ----------[回應 json]
app.get('/json-sales', (req, res) => {
  console.log('res.locals', res.locals.title);
  const data = require(__dirname + '/data/sales.json');
  // --require json 檔，會自動做 JSON.parse() 轉換為原生類型
  // --若變更 json 檔內容，server要重新啟動(用nodemon每次存檔就會重新啟動)，才會重新require，前端才會更新
  // --CJS require可以在檔案的任何地方；ESM import 只能在檔案最上方

  // res.json(data);
  // data 轉換為json字串，送給client，並設定 res Header/Content-Type: application/json

  const orderBy = req.query.orderBy || 'id';
  // console.log(orderBy);
  let dataSorted = data.sort((a, b) => {
    return (a[orderBy] > b[orderBy]) ? 1 : -1;
  });
  res.render('json-sales', {dataSorted});
});


// ----------[呈現資料(list)，排序資料]
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


// ----------[query string]
app.get('/try-qs', (req, res) => {
  console.log(req.query);
  // --req.query 將 query string 轉為物件

  // 把client req 的 query string 在傳回去給 client--
  res.json(req.query);
});


// ----------[GET / POST urlencoded / json]
// create middleware for single route***1
// // 建立 middleware 用來解析 post資料--
// const urlencodedParser = express.urlencoded({extended: false});
// // --使用 express 內建功能 body-parser
// // --extend: false -> 不要使用 qs 套件
// // --Content-Type 為 application/x-www-form-urlencoded 才會處理

// const jsonParser = express.json();
// // --Content-Type 為 application/json 才會處理


// app.post('/try-post', [urlencodedParser, jsonParser], (req, res) => {
// // --若有多個 middleware 可以用 array 包起來 [middleware1, middleware2]，依照順序執行(但不一定會處理，例如 urlencodedParser, jsonParser 會判斷 Content-Type)
//   console.log('req.body', req.body); // object
//   res.json(req.body);
//   // --若沒經過 middleware 解析，req.body = undefined
// });

// change the middleware to Top-level middleware***1
app.post('/try-post', (req, res) => {
  console.log('req.body', req.body);
  res.json(req.body);
});

app.get('/try-post', (req, res) => {
  res.json(req.query);
});


// ----------[表單送給自己]
// borwser url request: 回應表單
app.get('/try-post-form', (req, res) => {
  res.render('try-post-form');
  // 法2:
  // res.render('try-post-form', {account: '', password: ''});
});

// form submit: 回應有帶有資料的表單
app.post('/try-post-form', (req, res) => {
  console.log('req.body', req.body);
  // --req.body = {表單資料name: 表單資料value}
  res.render('try-post-form', req.body);
  // --在 template裡面用 locals 去拿到資料
});


// ----------[multer]
// 上傳單一檔案(image)(= 1)--
app.post('/try-upload', upload.single('avatar'), (req, res) => {
// --upload.single('avatar'): middleware ，上傳單一檔案，req.file = obj.fieldname: 'avatar'
  console.log('req.file', !req.file);
  let data = !req.file? '格式不符' : req.file;
  res.json(data);
});

// 上傳多個檔案(image)( >= 1)--
app.post('/try-uploads', upload.array('photos'), (req, res) => {
// --upload.array('photos'): middleware ，上傳多個檔案，req.files = array 裡面一個檔案一個 obj.fieldname: 'photos'
  res.json(req.files);
});

// 上傳多個檔案(image)，丟錯誤(不需要)，middleware 也可以放在 callback function 裡面--
app.post('/try-uploads-err', (req, res) => {
  console.log('req.files', req.files);
  uploadErr(req, res, function (err){
    // console.log(err);
    // if (err instanceof multer.MulterError){
    //   res.json('1');
    // } else if (err) {
    //   res.json([2, req.files]);
    //   console.log('req.files', req.files);
    // } else {
    //   res.json([3, req.files]);
    // }
    // --丟錯誤會讓全部的檔案無法上傳，如果只要抓出未上傳成功的檔案，不需要用到error

    res.json([3, req.files]);

  });
});

// 上傳多個檔案(video)( >= 1)--
app.post('/try-uploads-vdo', uploadVdo.array('photos'), (req, res) => {
  console.log('req.files', req.files);
  res.json(req.files);
});


// ----------[url參數]
app.get('/my-params1/:action?/:id', (req, res) => {
// --參數最後加? -> 參數可以不輸入
  console.log('req.params', req.params);
  res.json(req.params);
  // --參數值皆為字串
});
// --url沒加參數、參數不夠、參數太多 進不到這個路由 -> 加 ?


// ----------[regular expression 設定路由路徑]
app.get(/^\/hi\/?/, (req, res) => {
// -> ('/hi' + '/' 0 或 1次) 開頭

let result = {
  url: req.url
};
result.split = req.url.split('/');
res.json(result);
});

app.get(/\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
// -> 結尾 i(不區分大小寫)
// -> \/ 跳脫 '/'
// -> \d{2} : 2個數字
// -> -? : '-' 可有可無
// -> ***$ : 以 *** 結尾，後面不能加東西，可以加 query string

let tel = req.url.split('?')[0]; // query string 後面不要
tel = tel.slice(3).split('-').join('');
res.json(tel);
// res.send({tel});
});


// ----------[require router module in 'routes']
const admin2 = require(__dirname + '/routes/admin2');
app.use(admin2);
// => app.use('/', admin2); 不加路由路徑，預設掛在'/'下(baseUrl)，後面再加上 module router 的路由路徑(url)

app.use('/admin', admin2);
// => 掛在'/admin'下(baseUrl)，後面再加上 module router 的路由路徑(url)


// ----------[使用 session]
app.get('/try-sess', (req, res) => {
  req.session.my_var = req.session.my_var || 0;
  req.session.my_var ++;

  res.json({
    "my_var": req.session.my_var,
    "session": req.session
  });
});
// ----------[刪除 session]
app.get('/delete-sess', (req, res) => {
  if (req.session.my_var !== undefined){
    console.log('111');
    delete req.session.my_var;
    res.json(req.session);
  } else {
    console.log('222');
    res.json('no-session');
  }

});


// ----------[moment]
app.get('/try-moment', (req, res) => {
  const m1 = moment(); // moment物件，類似 new Date() //當下標準時間
  const d1 = new Date(); //當下標準時間

  const m1a = m1.format('YYYY-MM-DD HH:mm:ss'); // 當下目前時區時間
  const m1b = m1.tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss'); // 當下其他時區時間
  const m2 = moment([2020, 1, 7]).fromNow(); // 距離現在多久時間
  const m3 = moment("12-25-1995 09:00:00", "MM-DD-YYYY hh:mm:ss"); // 解析目前時區時間字串，轉為標準時間
  const m4 = moment('2025-1-1 08:00:00'); //輸入目前時區時間，轉為標準時間
  const m5 = moment("2023-01-07 12:55:24", "YYYY-MM-DD hh:mm:ss"); // 解析目前時區時間字串，轉為標準時間
  const m7 = moment("2010-01-01T05:06:07", moment.ISO_8601);
  const m8 = moment("2010-01-01T05:06:07Z", moment.ISO_8601);

  res.json({m1, d1, m1a, m1b, m2, m3, m4, m5, m7, m8});
});


// ----------[查詢資料庫 : 要使用非同步]
app.get('/try-db', async (req, res) => {
  // const [rows, fields] = await db.query("SELECT * FROM categories");
  // db.query(sql) 回傳 [results(query 的資料 obj in array), fields(資料表欄位資料)]
  // fields 用不到，解構第一個就好
  const [rows] = await db.query("SELECT * FROM categories");

  res.json({rows});
});


// ----------[使用 module route: address-book]
app.use('/address-book', require(__dirname + '/routes/address-book'));
// --require the exported route


// ----------[新增會員]
app.get('/add-member', async (req, res) => {
  const sql = "INSERT INTO `members`(`email`, `password`, `hash`, `nickname`, `create_at`) VALUES (?, ?, '', 'nick', NOW())";

  const password = await bcrypt.hash('12345', 8);

  const [result] = await db.query(sql, [
    'kris@test.com',
    password
  ]);

  res.json(result);
});

// ----------[會員登入: 登入表單]
app.get('/login', (req, res) => {
  // return res.render('login', {req});
  return res.render('login'); // 在 top-level middleware 將 req.session 設定給 res.locals
});
// ----------[會員登入: 登入api]
app.post('/login', upload.none(), async (req, res) => {
  const output = {
    success: false,
    data: req.body,
    code: 0,
    error: '',
    note: ''
  };

  const {email, password} = req.body;
  if (!email || !password){
    output.error = '欄位資料不足';
    output.code = 400;
    return res.json(output);
  }

  const sql = "SELECT * FROM members WHERE email=?";
  const [rows] = await db.query(sql, [email]);
  // output.note = rows;
  if (rows.length < 1){
    output.error = '帳號錯誤';
    output.code = 410;
    return res.json(output);
  }

  const row = rows[0];
  const passwordResult = await bcrypt.compare(password, row.password);
  if (passwordResult){
    output.success = true;
    req.session.user = {
      // email: email,
      email,
      nickname: row.nickname
    };
  } else {
    output.error = '密碼錯誤';
    output.code = 420;
  }

  return res.json(output);
});

// ----------[會員登出]
app.get('/logout', async (req, res) => {
  delete req.session.user;
  return res.redirect('/');
});

// ----------[假的a.html]
// app.use('/a.html', (req, res) => {
//   res.send(`<h2>假的a.html</h2>`);
// });


// ----------[public]
// 建立可以訪問'piblic'資料夾中的靜態內容的路由--
// 只能用 get
// app.use('/', express.static('public'));
// => 掛在'/'下，後面再加上檔案名稱
// --shorten--
app.use(express.static('public'));


// ----------[最後一道防線]
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
