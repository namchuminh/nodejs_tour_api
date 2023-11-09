const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const DonHang = sequelize.define("don_hang", {
    MaDonHang: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    MaTimKiem: {
        type: DataTypes.STRING,
        allowNull: false
    },
    MaTour: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MaKhachHang: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SoLuongVe: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    GhiChu: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    TrangThai: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    PhuongThucThanhToan: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: "don_hang"
});

module.exports = DonHang;
