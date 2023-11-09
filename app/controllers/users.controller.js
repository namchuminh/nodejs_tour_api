const { Op } = require('sequelize'); 
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

      if (khachhang.TrangThai == 0) {
        return res.status(401).json({ message: "Tài khoản không được phép hoạt động!" });
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
      const { TenKhachHang, Email, SoDienThoai, TaiKhoan, MatKhau } = req.body;

      if (!TenKhachHang || !Email || !SoDienThoai || !TaiKhoan || !MatKhau) {
        return res.status(400).json({ error: "Vui lòng nhập đủ thông tin!" });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) return res.status(400).json({ error: "Email không hợp lệ!" });

      if (!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(SoDienThoai)) return res.status(400).json({ error: "Số điện thoại không hợp lệ!" });

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

      if (emailCheck) return res.status(400).json({ error: "Email đã tồn tại!" });
      if (soDienThoaiCheck) return res.status(400).json({ error: "Số điện thoại đã tồn tại!" });
      if (taiKhoanCheck) return res.status(400).json({ error: "Tài khoản đã tồn tại!" });

      if (await KhachHang.create({ TenKhachHang, Email, SoDienThoai, TaiKhoan, MatKhau: md5(MatKhau), TrangThai: 1 })) {
        return res.status(201).json({ error: "Đăng ký tài khoản thành công!" });
      } else {
        return res.status(400).json({ error: "Có lỗi khi đăng ký tài khoản!" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Đã xảy ra lỗi không xác định!" });
    }
  }

  //[GET] /users
  async index(req, res) {
    try {
        const { s } = req.query;
        let { page } = req.query;
        const limit = 10;
        let offset = 0;

        if(page){
            if(page <= 0){
                page = 1;
            }
            offset = (page - 1) * limit;
        }
        
        let data;

        if (s) {
            data = await KhachHang.findAndCountAll({
                where: { TenKhachHang: { [Op.like]: '%' + s + '%' } },
                limit,
                offset,
                attributes: { exclude: ['MatKhau']}
            });
        } else {
            data = await KhachHang.findAndCountAll({ limit, offset, order: [['MaKhachHang', 'DESC']], attributes: { exclude: ['MatKhau'] }});
        }

        const transformedData = data.rows.map(user => ({
            ...user.toJSON(),
            TrangThai: user.TrangThai == 1 ? "Hoạt động" : "Bị chặn"
        }));

        const totalPages = Math.ceil(data.count / limit);
        return res.status(200).json({ data: transformedData, totalPages, perPage: limit, totalRows: data.count, currentPage: page ? page : 1  });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Đã xảy ra lỗi chưa xác định!" });
    }
  }

  //[GET] /users/:id
  async detailUser(req, res) {
    try {
      const {id} = req.params;

      if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

      if(req.user.ChucVu == 0 && req.user.MaKhachHang != id) return res.status(403).json({ error: "Không được phép!" });

      const user = await KhachHang.findOne({
        where: {
          MaKhachHang:id
        }
      });

      if (!user) return res.status(400).json({ error: "Không tồn tại khách hàng!" });

      if (user.TrangThai == 0) {
        return res.status(403).json({ message: "Tài khoản không được phép hoạt động!" });
      }

      const transformedTrangThai = user.TrangThai === 1 ? 'Hoạt động' : 'Bị chặn';
      const userWithAlias = { ...user.toJSON(), TrangThai: transformedTrangThai };

      return res.status(200).json({ data: userWithAlias });
    } catch (error) {
      return res.status(500).json({ error: "Đã xảy ra lỗi không xác định!" });
    }
  }

  //[UPDATE] /users/:id
  async editUser(req, res) {
    try {
      const {id} = req.params;

      if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

      if(req.user.ChucVu == 0 && req.user.MaKhachHang != id) return res.status(403).json({ error: "Không được phép!" });

      const user = await KhachHang.findOne({
        where: {
          MaKhachHang:id
        }
      });

      if (!user) return res.status(400).json({ error: "Không tồn tại khách hàng!" });

      const {TenKhachHang,Email,SoDienThoai,MatKhau,XacNhanMatKhau} = req.body;

      if(!TenKhachHang || !Email || !SoDienThoai ){
        return res.status(400).json({ error: "Vui lòng nhập đủ thông tin khách hàng!" });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) return res.status(400).json({ error: "Email không hợp lệ!" });

      if (!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(SoDienThoai)) return res.status(400).json({ error: "Số điện thoại không hợp lệ!" });

      if(MatKhau){
        if (MatKhau !== XacNhanMatKhau) return res.status(400).json({ error: "Mật khẩu không trùng khớp!" });
        const updatedUser = await KhachHang.update({TenKhachHang,Email,SoDienThoai,MatKhau: md5(MatKhau)}, {
          where: {
            MaKhachHang: id,
          },
        });
        if(!updatedUser) return res.status(400).json({ error: "Cập nhật thông tin khách hàng thất bại, vui lòng thử lại!" });
      }else if(!MatKhau){
        const updatedUser = await KhachHang.update({TenKhachHang,Email,SoDienThoai}, {
          where: {
            MaKhachHang: id,
          },
        });
        if(!updatedUser) return res.status(400).json({ error: "Cập nhật thông tin khách hàng thất bại, vui lòng thử lại!" });
      }

      const userUpdated = await KhachHang.findOne({
        where: {
          MaKhachHang:id
        },
        attributes: { exclude: ['MatKhau'] }
      });

      const transformedTrangThai = userUpdated.TrangThai === 1 ? 'Hoạt động' : 'Bị chặn';
      const userUpdatedWithAlias = { ...userUpdated.toJSON(), TrangThai: transformedTrangThai };

      return res.status(200).json({ data: userUpdatedWithAlias });
    } catch (error) {
      return res.status(500).json({ error: "Đã xảy ra lỗi không xác định!" });
    }
  }

  //[POST] /users/:id/block
  async blockUser(req, res) {
    try {
      const {id} = req.params;

      if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

      const user = await KhachHang.findOne({
        where: {
          MaKhachHang:id
        }
      });

      if (!user) return res.status(400).json({ error: "Không tồn tại khách hàng!" });

      const TrangThai = user.TrangThai == 1 ? 0 : 1;

      const updatedUser = await KhachHang.update({TrangThai}, {
        where: {
          MaKhachHang: id,
        },
      });
      
      if (!updatedUser) return res.status(400).json({ error: TrangThai == 0 ? "Chặn khách hàng thất bại, vui lòng thử lại!" : "Bỏ chặn khách hàng thất bại, vui lòng thử lại!" });

      const userUpdated = await KhachHang.findOne({
        where: {
          MaKhachHang:id
        },
        attributes: { 
          exclude: ['MatKhau']
        }
      });

      const transformedTrangThai = userUpdated.TrangThai === 1 ? 'Hoạt động' : 'Bị chặn';
      const userUpdatedWithAlias = { ...userUpdated.toJSON(), TrangThai: transformedTrangThai };

      return res.status(200).json({ data: userUpdatedWithAlias });
    } catch (error) {
      return res.status(500).json({ error: "Đã xảy ra lỗi không xác định!" });
    }
  }
}

module.exports = new users();