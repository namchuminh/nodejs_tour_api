const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const Tours = sequelize.define("tours", {
    MaTour: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    TenTour: {
        type: DataTypes.STRING,
        allowNull: false
    },
    MoTa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    GiaVe: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SoLuongVe: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MaDiemDen: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    AnhChinh: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    DuongDan: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    MaNhanVien: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
  tableName: "tours" 
});

module.exports = Tours;
