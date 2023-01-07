const express = require('express');
const db = require(__dirname + '/../modules/connect-mysql');

const router = express.Router();

router.get('/', async (req, res) => {
  const t_sql = "SELECT COUNT(1) totalRows FROM address_book";

  // const [rows] = await db.query(t_sql);
  // const [totalRowsObj] = rows;
  // const {totalRows} = totalRowsObj;
  // res.json(totalRows);
  // --shorten--
  const [[{totalRows}]] = await db.query(t_sql);
  res.json(totalRows);


});

module.exports = router;