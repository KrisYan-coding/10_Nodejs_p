
const mysql = require('mysql2');

// 建立連線池--
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // port: process.env.DB_PORT,
  waitForConnections: true,  // 忙碌時是否允許等待
  connectionLimit: 5, // 最大連線數
  queueLimit: 0 // 允許排隊人數，0: 不限 

});

// 匯出 connection.promise()，用來 query 資料--
module.exports = pool.promise();
// --.promise(): to "upgrade" an existing non-promise connection to use promise