const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const TinTuc = sequelize.define("thong_tin_tour", {
    MaTinTuc: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    TieuDe: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    NoiDung: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    AnhChinh: {
        type: DataTypes.TEXT, 
        allowNull: false
    },
    MaNhanVien: {
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    MaChuyenMuc: {
        type: DataTypes.INTEGER, 
    },
    DuongDan: {
        type: DataTypes.TEXT, 
        allowNull: false
    },
}, {
    tableName: "tin_tuc"
});

module.exports = TinTuc;
