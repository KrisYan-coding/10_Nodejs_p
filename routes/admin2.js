const express = require('express');

const router = express.Router();

router.get('/admin2/:action?/:id?', (req, res) => {
  // res.json(req.params);

  // 解構--
  const {params, url, baseUrl, originalUrl} = req;
  // req.params, req.url, req.baseUrl, req.originalUrl
  // req.url : route 設定的路徑
  // req.baseUrl : 這個 route 掛在哪個路徑下
  // req.url : 完整的路徑
  res.json({...params, url, baseUrl, originalUrl});
});

module.exports = router;