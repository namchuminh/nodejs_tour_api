const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const ChuyenMuc = sequelize.define("chuyen_muc", {
    MaChuyenMuc: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    TenChuyenMuc: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    DuongDan: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    tableName: "chuyen_muc"
});

module.exports = ChuyenMuc;
