const {DataTypes} = require('sequelize');
const sequelize = require('../init_db');

//Feed Model 
const Feed =  sequelize.define("feed",{
    ID : {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    url:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    }
},
{
  timestamps: false
});

module.exports = Feed;