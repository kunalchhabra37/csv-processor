const sequelize = require('../config/database')
const { DataTypes} = require('sequelize')
const StatusMapper = sequelize.define('statusMapper', {
    id: {
        type: DataTypes.TINYINT,
        primaryKey: true
    },
    name: {
        type: DataTypes.TEXT
    }
}, {
    tablename: 'status_mapper',
    indexes: [
        {
            unique: true, 
            fields: ['id']
        }
    ]
})

module.exports = StatusMapper