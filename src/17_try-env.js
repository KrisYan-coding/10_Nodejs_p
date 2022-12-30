require('dotenv').config();
// --載入 .env

// 若 .env 不在專案底層(要完整路徑)
// require('dotenv').config({
//   path: 'C:/Users/user/Documents/FrontEndClass/11_Nodejs_p/.env',
// });

console.log(process.env.MY_USER);
