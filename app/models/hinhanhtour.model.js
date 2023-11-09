const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const HinhAnhTour = sequelize.define("hinh_anh_tour", {
    MaHinhAnh: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    MaTour: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DuongDan: {
        type: DataTypes.TEXT, 
        allowNull: false
    }
}, {
    tableName: "hinh_anh_tour"
});

module.exports = HinhAnhTour;
