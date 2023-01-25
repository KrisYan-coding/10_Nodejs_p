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
  const [rows] = await db.query(sql);
  // --rows = [{}, {}, ...]

  return res.json(rows);
});

module.exports = router;