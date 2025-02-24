const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Products = require('./products')
const Images = sequelize.define(
  "images",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Products,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    input_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    output_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "images",
    indexes: [
      {
        unique: true,
        fields: ["id"],
      }
    ],
  }
);
Images.belongsTo(Products, { foreignKey: "product_id" });

module.exports = Images;
