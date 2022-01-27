const {db} = require('../db');
const Sequelize = require('sequelize');

const DataTypes = Sequelize.DataTypes

const User = db.define('users', {
    username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false  
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
        allowNull: false
    } 
});

module.exports = { User };