const express = require('express');
const db = require(__dirname + '/../modules/connect-mysql');
const upload = require('../modules/upload-img');
const moment = require('moment-timezone');

const router = express.Router();

// 設定 top-level middleware -> 只有掛在 /address-book 下的路由才會經過--
// 當在 index 設定的 baseUrl: /address-book 改變時，template 中的連結可以一起變動 -> 將 baseUrl 作為參數傳到 template 中
router.use((req, res, next) => {
  const {url, baseUrl, originalUrl} = req;

  res.locals = {...res.locals, url, baseUrl, originalUrl};

  next();
});

const getListDate = async (req, res) => {

  let page = +req.query.page || 1; 
  // -- + 字串轉數值 -> +"1" = 1, +"1.5" = 1.5, +"aaa" = NaN, +undefined = NaN 

  if (page < 1){
    return res.redirect(req.baseUrl + req.url);
    // --add return to end the function 
  }
  
  const perPage = 5;
  const t_sql = "SELECT COUNT(1) totalRows FROM address_book";

  // const [rows] = await db.query(t_sql);
  // const [totalRowsObj] = rows;
  // const {totalRows} = totalRowsObj;
  // res.json(totalRows);
  // --shorten--
  const [[{totalRows}]] = await db.query(t_sql);
  const totalPages = Math.ceil(totalRows/perPage);

  let rows = [];
  if (totalPages > 0){
    if (page > totalPages){
      return res.redirect('?page=' + totalPages);
    }

    const sql = `SELECT * FROM address_book ORDER BY sid DESC LIMIT ${(page - 1)*perPage}, ${perPage}`;
    [rows] = await db.query(sql);
  }

  return {totalRows, totalPages, page, rows}; 
};


// --------------------[拿到資料列表頁面]
router.get('/', async (req, res) => {
  const output = await getListDate(req, res);
  res.render('ab-list', output);
});

// --------------------[拿到資料]
router.get('/api', async (req, res) => {
  let output = await getListDate(req, res);
  // for(let item of output.rows){
  //   // item.birthday2 = res.locals.toDateString(item.birthday);
  //   // --直接設定另一個屬性 birthday2 給 item
  //   item.birthday = res.locals.toDateString(item.birthday);
  //   // --直接覆蓋 item 原有的 birthday 屬性
  // }

  output.rows = output.rows.map(el => {
    el.birthday = res.locals.toDateString(el.birthday);
    // --因在 top-level middleware 有將 toDateString() 設定為 res 屬性，所以可以直接呼叫 res.locals.toDateString()
    return el;
  });
  
  res.json(output);
});


// --------------------[get : 呈現新增表單]
router.get('/add', async (req, res) => {
  res.render('ab-add');
});

// --------------------[post : 新增資料 api(使用 upload.none() 解析 req.body)]
router.post('/add', upload.none(), async (req, res) => {
// --use upload.none() as middleware to handle a text-only miltipart form

  let output = {
    success: false,
    postData: req.body,
    code: 0,
    errors: {},
  };

  let {name, email, mobile, birthday, address} = req.body;

  if (!name){
    output.errors.name = '姓名為必填';
    return res.json(output);
  } 
  if (name.length < 2) {
    output.errors.name = '姓名長度不能小於 2';
    return res.json(output);
  }

  birthday = (moment(birthday).isValid()) ? moment(birthday).format('YYYY-MM-DD') : null;
  // if (! birthday){
  //   output.errors[birthday] = ''
  // }

  // TODO: 資料檢查

  const sql = "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())";
  
  const [result] = await db.query(sql, [name, email, mobile, birthday, address]);
  // --對應 ? 順序
  output.result = result;
  // --result.affectedRows
  output.success = !!result.affectedRows;
  
  res.json(output);
});

// --------------------[post : 新增資料 api(使用 body-parser(已在 index.js 設定 top-level middleware) 解析 req.body)]
// router.post('/add', async (req, res) => {
// // --use upload.none() as middleware to handle a text-only miltipart form

//   // TODO: 資料檢查

//   res.json(req.body);
// });

// --------------------[get : 呈現修改表單]
router.get('/edit/:sid', async (req, res) => {
// --沒有加參數無法進到此路由
  let output = {
    errors: '',
    note: ''
  };

  const sid = +req.params.sid || 0;
  // --輸入無法轉為數字的 sid 則為 0

  if (!sid){
    output.errors = 'invalid sid';
    // return res.json(output);
    return res.redirect(req.baseUrl); // 轉向到 /address-book
  }

  const sql = "SELECT * FROM `address_book` WHERE sid=?";

  const [rows] = await db.query(sql, [sid]);

  // 輸入的 sid 查無資料--
  if (rows.length < 1){
    output.errors = 'no sid';
    return res.redirect(req.baseUrl);
  }

  const row = rows[0];
  
  res.render('ab-edit', {row});
});

// --------------------[put : 修改資料 api(使用 upload.none() 解析 req.body)]
router.put('/edit/:sid', upload.none(), async (req, res) => {
  // --use upload.none() as middleware to handle a text-only miltipart form
  
    let output = {
      success: false,
      postData: req.body,
      code: 0,
      errors: {},
    };
  
    let {name, email, mobile, birthday, address} = req.body;
  
    if (!name){
      output.errors.name = '姓名為必填';
      return res.json(output);
    } 
    if (name.length < 2) {
      output.errors.name = '姓名長度不能小於 2';
      return res.json(output);
    }
  
    birthday = (moment(birthday).isValid()) ? moment(birthday).format('YYYY-MM-DD') : null;
    // if (! birthday){
    //   output.errors[birthday] = ''
    // }
  
    // TODO: 資料檢查
  
    // const sql = "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())";
    
    // const [result] = await db.query(sql, [name, email, mobile, birthday, address]);
    // // --對應 ? 順序
    // output.result = result;
    // // --result.affectedRows
    // output.success = !!result.affectedRows;
    
    // res.json(output);

    res.json(req.body);
  });

// --------------------[刪除資料]
router.delete('/:sid', async (req, res) => {
  let output = {
    success: false,
    errors: ''
  };

  const sid = +req.params.sid || 0;
  if (! sid){
    output.errors = 'no sid';
    return res.json(output);
  }

  const sql = "DELETE FROM `address_book` WHERE sid=?";

  const [result] = await db.query(sql, [sid]);

  output.success = !!result.affectedRows;
  
  return res.json(output);
});

// 匯出 route--
module.exports = router;