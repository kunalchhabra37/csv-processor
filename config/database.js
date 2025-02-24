const Sequelize = require("sequelize");
const path = require("path");
const config = {
  dialect: "sqlite",
  storage: path.join(__dirname, "../", "db", "database.sqlite"),
  logging: false,
};
const sequelize = new Sequelize(config);

module.exports = sequelize;
