const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const ThongTinTour = sequelize.define("thong_tin_tour", {
    MaThongTinTour: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    MaDiemDen: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DiemKhoiHanh: {
        type: DataTypes.STRING,
        allowNull: false
    },
    NgayKhoiHanh: {
        type: DataTypes.DATE, 
        allowNull: false
    },
    NgayQuayVe: {
        type: DataTypes.DATE, 
        allowNull: false
    },
    KhachSan: {
        type: DataTypes.INTEGER, 
    },
    SanBay: {
        type: DataTypes.INTEGER, 
    },
    Wifi: {
        type: DataTypes.INTEGER, 
    },
    BuaSang: {
        type: DataTypes.INTEGER, 
    },
    BaoHiem: {
        type: DataTypes.INTEGER, 
    },
    PhuongTien: {
        type: DataTypes.INTEGER, 
    },
    MaTour: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "thong_tin_tour"
});

module.exports = ThongTinTour;
