const express = require('express');
const db = require(__dirname + '/../modules/connect-mysql');
const upload = require('../modules/upload-img');
const moment = require('moment-timezone');
const { route } = require('./address-book');

const router = express.Router();

router.use((req, res, next) => {

  const {url, baseUrl, originalUrl} = req;

  res.locals = {...res.locals, url, baseUrl, originalUrl};

  next();
});

router.get('/', async (req, res) => {
  
  const sql = "SELECT * FROM `products` WHERE 1";
  let [rows] = await db.query(sql);
  // --rows = [{}, {}, ...]

  // rows = rows.map(el => {
  //   el.publish_date = moment(el.publish_date).format('YYYY-MM-DD');
  //   return el;
  // });

  return res.json(rows);
});


router.get('/toggle-like/:sid', async (req, res) => {
  let output = {
    success: false,
    params: req.params,
    error: '',
    code: 0,
    action: '',
    note: ''
  };

  const sid = req.params.sid;
  
  if (!req.session.user){
    output.error = '必須先登入會員，才能加到最愛';
    output.code = 100;
    return res.json(output);
  }

  // 確認編號為 sid 的產品是否存在--
  const sql_check_sid = "SELECT * FROM `products` WHERE sid=?";
  const [rows] = await db.query(sql_check_sid, [sid]);
  if (rows.length < 1){
    output.error = '產品不存在';
    output.code = 200;
    return res.json(output);
  }
  output.note = rows;

  // 確認資料是否存在--
  const sql_check_repeat = "SELECT * FROM `product_likes` WHERE `member_id`=? AND `product_id`=?";
  const [rows2] = await db.query(sql_check_repeat, [req.session.user.id, sid]);

  // 如果存在則刪除: 取消收藏--
  if (rows2.length){
    const sql_delete = "DELETE FROM `product_likes` WHERE `sid`=" + rows2[0].sid;
    const [result] = await db.query(sql_delete);
    output.success = !! result.affectedRows;
    output.action = 'delete';
  } else {
    const sql_insert = "INSERT INTO `product_likes`(`member_id`, `product_id`) VALUES (?, ?)";
    const [result] = await db.query(sql_insert, [req.session.user.id, sid]);
    output.success = !! result.affectedRows;
    output.action = 'insert';
  }

  res.json(output);
});

// ----------[會員登出]
router.get('/logout', (req, res) => {
  delete req.session.user;
  return res.json('logout ok');
});

// ----------[跳轉至會員登入，再回到原頁面]
router.get('/login', (req, res) => {
  req.session.lastPage = req.headers.referer;
  return res.redirect('/login');
});


module.exports = router;