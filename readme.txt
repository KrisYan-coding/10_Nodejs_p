
// --------------------------[cmd]
node -v
npm -v
npm init -y
npm i -g es-checker
npm list -g
npm --help
npm install --help
npm uninstall -g es-checker
npm un -g es-checker
npm i dotenv --save-dev (此套件開發時會用到，發布後用不到)
npm un dotenv --save-dev
npm i (自動安裝 package.json "dependencies"全部的套件)

node src\001.js
nodemon src\001.js
pm2 start src\001.js
-> pm2 更新檔案，不會自動重啟，但程式執行時有問題會重新啟動
pm2 stop all
pm2 stop 0
pm2 restart 0

package.json "scripts" 設定cmd snippet
npm start (start, test 不用加 run)
npm run dev


// --------------------------[definition]
ESM = ES module
靜態內容 = 內容沒有經過後端程式或server去做變更(純 html/CSS/JS/image)
樣板引擎 = 在 html 裡面寫程式
-> 把 js 寫在 html 放在 .ejs
-> 把 php 寫在 html 放在 .php


// --------------------------[process]
process 行程 -> 執行一隻程式
thread 執行緒 -> 一隻程式裡面可以有多個執行緒
node 預設, 前端js: 單行程 單執行緒

process: node 內建物件
> process.argv
[ 'C:\\Program Files\\nodejs\\node.exe' ]
> process.env
環境變數


// --------------------------[project]
***資料夾***
    public/static : 存放靜態內容(url可以直接訪問的)
    node_modules : 此專案所有用到的套件
    node_modules/bin : 可以在此專案的 cmd 用 npx 'filename' 使用套件的功能
    views : 存放樣板引擎(要回應的)
    routes : 存放路由模組 (將路另外設定在其他檔案，在 index.js 中再 require 進來)

***設定檔***
    .env : 環境變數(等號左右不要空白)
    package.json "dependencies" : 此專案安裝那些套件
    package-lock.json 展開所有此專案用到的套件(包含依賴的套件)
    package.json "main": index.js 主程式 (nodemon 預設執行index.js)


// --------------------------[輸入輸出]
***輸出給 client***
-> 同一個路由使用下面其中一個一次就好
    res.end() : node
    res.send() : node express；自動判斷 Content-Type
    res.render() : node express 呈現樣板
    res.json() : Content-Type: applocation/json
    res.redirect() : 頁面轉向

***client 輸入的資訊***
    req.query : 取得 GET query string parameters
    req.body : 取得 POST 表單資料
    req.file : 取的上傳的單一檔案
    req.files : 取的上傳的多個檔案
    req.params : 網址列上的參數
    req.url : domain 之後
    req.session : 使用 express-session

// --------------------------[前端 query string to obj]
const usp = new URLSearchParams(location.search);
  usp.toString() = 'a=100&b=200'
  location.search = 'a=100&b=200'
const obj = [...usp.entries()];

// --------------------------[判斷變數是否有設定]
typeof aaa
>>>'undefined'

obj = {};
obj.aaa;
>>>'undefined'

obj = {};
obj.aaa.bbb;
>>> error -> 一層可以兩層不行

obj = {};
obj.aaa?.bbb; -> 一層沒有就不要往下
>>>'undefined'

// --------------------------[RESTful 簡略的規則]
  GET /product       -> 取得資料列表
  GET /product/:pid  -> 取得單筆資料

  POST /product      -> 新增資料
  PUT /product/:pid  -> 修改資料
  POST /product/:pid -> 刪除資料

// --------------------------[others]
1. 大專不要用 EJS，用 react
2. browser 直接 query -> method: GET
3. 瀏覽器可以撥放的影片格式: mp4(O) h264(O) h265(X)
4. 圖片壓縮 jimp / sharp
5. req.query vs. req.params(better SEO)
6. domain 不一樣不能存取 cookie/session，驗證需透過 JWT 處理
7. Connection pools: (6)34:00
8. window.history
    .back() 上一頁
    .forward() 下一頁
    .pushState() 新增頁面
9. PDP: protocol + domain + port
10. joi.dev 資料欄位驗證套件


// --------------------------[問題]
1. 上傳多張圖片時，如果有一張格式不符，如何知道是哪一張?

// --------------------------[for of 直接改變 array element]
// array 第一層 不能改變--
a = [1, 2, 3]
for(let item of a){item = item +1}
>>> a = [1, 2, 3]

// array 第一層後 可以改變--
  a = [{age: 10}, {age: 20}, {age: 30}]
  for (let item of a){ item.age = 100 }
  >>> a = [{age: 100}, {age: 100}, {age: 100}]

  a = [['age', 10], ['age', 20], ['age', 30]]
  for(let item of a){item[0] = 'name'}
  >>> a = [['name', 10], ['name', 20], ['name', 30]]

// --------------------------[CORS - 預防嵌站、釣魚網站]
1. 瀏覽器不會知道 IP & domain 的關係，都會被視為字串
2. 同一個檔案預設不可以拜訪不同的 server，server 會收到 req，也會回應 res，但瀏覽器預設會擋掉不同來源(server)的 resave
 -> cors package 可以將回應的 res : "Access-Control-Allow-Origin": * 設為 * 表示接受任何 來自不同來源的檔案 來要資料
3. postman 不是瀏覽器，不會有 CORS 機制

