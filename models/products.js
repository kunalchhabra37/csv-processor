const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Products = sequelize.define(
  "products",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
  },
  {
    tableName: "products",
    indexes: [
      {
        unique: true,
        fields: ["id"],
      }
    ],
  }
);

module.exports = Products;
