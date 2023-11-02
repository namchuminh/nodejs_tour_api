const KhachHang = require("../models/khachhang.model.js");
const Blacklist = require("../models/blacklist.model.js");
const jwt = require("jsonwebtoken");
const md5 = require("md5");

class users {
  //[POST] /users/login
  async login(req, res) {
    const { TaiKhoan, MatKhau } = req.body;

    try {
      const khachhang = await KhachHang.findOne({
        where: {
          TaiKhoan: TaiKhoan,
          MatKhau: md5(MatKhau)
        }
      });

      if (!khachhang) {
        return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
      }

      const accessToken = jwt.sign({ MaKhachHang: khachhang.MaKhachHang, ChucVu: 0 }, "SECRET_KEY", {
        expiresIn: "24h"
      });

      const refreshToken = jwt.sign({ MaKhachHang: khachhang.MaKhachHang }, "SECRET_KEY_REFRESH", {
        expiresIn: "30d"
      });

      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }

  //[POST] /users/logout
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

  //[POST] /users/register
  async register(req, res) {
    try {
      const { TenKhachHang,Email,SoDienThoai,TaiKhoan,MatKhau } = req.body;

      if(!TenKhachHang || !Email || !SoDienThoai || !TaiKhoan || !MatKhau){
        return res.status(400).json({ error: "Vui lòng nhập đủ thông tin!" });
      }

      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) return res.status(400).json({ error: "Email không hợp lệ!" });

      if(!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(SoDienThoai)) return res.status(400).json({ error: "Số điện thoại không hợp lệ!" });

      const emailCheck = await KhachHang.findOne({
        where: {
          Email
        }
      });

      const soDienThoaiCheck = await KhachHang.findOne({
        where: {
          SoDienThoai
        }
      });

      const taiKhoanCheck = await KhachHang.findOne({
        where: {
          TaiKhoan
        }
      });

      if(emailCheck) return res.status(400).json({ error: "Email đã tồn tại!" });
      if(soDienThoaiCheck) return res.status(400).json({ error: "Số điện thoại đã tồn tại!" });
      if(taiKhoanCheck) return res.status(400).json({ error: "Tài khoản đã tồn tại!" });

      if(await KhachHang.create({ TenKhachHang,Email,SoDienThoai,TaiKhoan,MatKhau:md5(MatKhau),TrangThai:1 })){
        return res.status(201).json({ error: "Đăng ký tài khoản thành công!" });
      }else{
        return res.status(400).json({ error: "Có lỗi khi đăng ký tài khoản!" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Đã xảy ra lỗi không xác định!" });
    }
  }
}

module.exports = new users();