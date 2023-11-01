const NhanVien = require("../models/nhanvien.model.js");
const Blacklist = require("../models/blacklist.model.js");
const jwt = require("jsonwebtoken");
const md5 = require("md5");

class admin {
  //[POST] /admin/login
  async login(req, res) {
    const { TaiKhoan, MatKhau } = req.body;

    try {
      const nhanVien = await NhanVien.findOne({
        where: {
          TaiKhoan: TaiKhoan,
          MatKhau: md5(MatKhau)
        }
      });

      if (!nhanVien) {
        return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
      }

      const accessToken = jwt.sign({ MaNhanVien: nhanVien.MaNhanVien, ChucVu: nhanVien.ChucVu }, "SECRET_KEY", {
        expiresIn: "24h"
      });

      const refreshToken = jwt.sign({ MaNhanVien: nhanVien.MaNhanVien }, "SECRET_KEY_REFRESH", {
        expiresIn: "30d"
      });

      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }

  //[POST] /admin/logout
  async logout(req, res) {
    const token = req.header("Authorization").split(" ")[1];
    try {

      const blacklistedToken = await Blacklist.findOne({ where: { token: token } });

      if (blacklistedToken) {
        return res.status(401).json({ message: "Token đã hết hạn hoặc không hợp lệ!" });
      }

      await Blacklist.create({ token: token });

      res.status(200).json({ message: "Đăng xuất thành công!" });
    } catch (error) {
      res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }
}

module.exports = new admin();