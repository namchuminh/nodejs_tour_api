const Sequelize = require('sequelize');
const sequelize = new Sequelize('nodejs_tour', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
  logging: false, // tắt log
});

module.exports = sequelize;