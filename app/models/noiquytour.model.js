const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const NoiQuyTour = sequelize.define("noi_quy_tour", {
    MaNoiQuy: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    MaTour: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    TrangPhuc: {
        type: DataTypes.TEXT, 
        allowNull: false
    },
    DoDung: {
        type: DataTypes.TEXT, 
        allowNull: false
    },
    DoTuoi: {
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    NoiQuyKhac: {
        type: DataTypes.TEXT, 
        allowNull: false
    }
}, {
    tableName: "noi_quy_tour"
});

module.exports = NoiQuyTour;
