
const multer = require('multer');
const {v4 : uuidv4} = require('uuid');

const extMap = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
};

// 定義一個 fileFilter 篩選要上傳的檔案
// ***fileFilter = function (req, file, cb){}***
// the function should call 'cb' with a boolean to indicate if the file should be accepted
// to reject this file -> cb(null, false)
// to accept this file -> cb(null, true)
// pass an error if something goes wrong -> cb(new Error('I don\'t have a clue!'))
const fileFilter = (req, file, cb) => {
// req=req ; file=req.file ；cb=callback function

  // 如果檔案副檔名有在 extMap 裡面才上傳
  const uploadFlag = !! extMap[file.mimetype];
  console.log('extMap[file.mimetype]', extMap[file.mimetype]);
  console.log('!!extMap[file.mimetype]',!!extMap[file.mimetype]);
  cb(null, uploadFlag);

};

// 定義一個 storage 用來儲存檔案到磁碟
const storage = multer.diskStorage({
  // determine within which folder the uploaded files should be stored
  destination: (req, file, cb) => {
    cb(null, __dirname + '/../public/uploads');
    // --first: 要丟出的錯誤，null=沒有；second: 檔案要存放的路徑
  },

  // determine what the file should be named inside the folder
  filename: (req, file, cb) => {
    const filename = uuidv4() + extMap[file.mimetype];
    // --extMap[file.mimetype] : 一定會對應到，因會先經過 fileFilter ，uploadFlag 為 true 才會再到 storage

    cb(null, filename);
    // --first: 要丟出的錯誤，null=沒有；second: 檔案要儲存的檔名
  }
});

// 匯出 upload 物件
module.exports = multer({fileFilter, storage});