const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const DiemDen = sequelize.define("diem_den", {
    MaDiemDen: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    TenDiemDen: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    MoTa: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    AnhChinh: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    HinhAnh: {
        type: DataTypes.TEXT
    },
    GoogleMap: {
        type: DataTypes.TEXT
    },
    MaChuyenMuc: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "diem_den"
});

module.exports = DiemDen;
