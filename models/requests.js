const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Requests = sequelize.define('requests', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: true,
    comment: '1 => received, 2 => processing, 3 => processed, 4 => Error',
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  output_file: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  webhook: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  create_date: {
    type: DataTypes.DATE,
  },
  modify_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'requests',
  indexes: [
    {
      unique: true,
      fields: ['id'],
    }
  ],
});

module.exports = Requests;
