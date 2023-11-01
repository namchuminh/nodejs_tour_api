const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const Blacklist = sequelize.define("blacklist ", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
  tableName: "blacklist" ,
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Blacklist;
