
// --------------------------
node -v
npm -v
npm init -y
npm i -g es-checker
npm list -g
npm --help
npm install --help
npm uninstall -g es-checker
npm un -g es-checker

node src\001.js
nodemon src\001.js
pm2 start src\001.js
-> pm2 更新檔案，不會自動重啟，但程式執行時有問題會重新啟動
pm2 stop all
pm2 stop 0
pm2 restart 0


// --------------------------
ESM = ES module


// --------------------------
process 行程 -> 執行一隻程式
thread 執行緒 -> 一隻程式裡面可以有多個執行緒
node 預設, 前端js: 單行程 單執行緒

process: node 內建物件
> process.argv
[ 'C:\\Program Files\\nodejs\\node.exe' ]
> process.env
環境變數
