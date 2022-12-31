
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
public/static : 存放靜態內容
node_modules: 此專案所有用到的套件

***設定檔***
.env : 環境變數(等號左右不要空白)
package.json "dependencies" : 此專案安裝那些套件
package-lock.json 展開所有此專案用到的套件(包含依賴的套件)
package.json "main": index.js 主程式 (nodemon 預設執行index.js)