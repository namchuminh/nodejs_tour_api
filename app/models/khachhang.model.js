const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const KhachHang = sequelize.define("khachhang", {
    MaKhachHang: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    TenKhachHang: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    SoDienThoai: {
        type: DataTypes.STRING,
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
  tableName: "khach_hang" 
});

module.exports = KhachHang;
