const multer = require('multer');

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Thay đổi đường dẫn tới thư mục lưu trữ ảnh của bạn
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Tạo tên file mới bằng cách thêm timestamp vào tên file gốc
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + '-' + file.originalname.split(".")[0] + '.png');
  }
});

// Middleware upload ảnh
const upload = multer({ storage: storage });

module.exports = upload;