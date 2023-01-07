const express = require('express');
const db = require(__dirname + '/../modules/connect-mysql');

const router = express.Router();

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

// 拿到資料列表頁面--
router.get('/', async (req, res) => {
  const output = await getListDate(req, res);
  res.render('ab-list', output);
});

// 拿到資料--
router.get('/api', async (req, res) => {
  const output = await getListDate(req, res);
  res.json(output);
});

module.exports = router;