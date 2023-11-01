const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const NhanVien = sequelize.define("nhanvien", {
  MaNhanVien: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TenNhanVien: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ChucVu: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  TaiKhoan: {
    type: DataTypes.STRING,
    allowNull: false
  },
  MatKhau: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "nhan_vien" 
});

module.exports = NhanVien;
