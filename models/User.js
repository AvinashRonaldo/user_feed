const {DataTypes} = require('sequelize');
const sequelize = require('../init_db');
const Feed = require('./Feed');

//User Model
const User =  sequelize.define("user",{
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
    role:{
        type:DataTypes.ENUM,
        values:['Super Admin','Admin','User'],
        defaultValue:'User',
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
},
{
  timestamps: false
});

//User-Feed Model having
//many-to-many relationship.
const UserFeeds = sequelize.define('UserFeed', {
    ID: {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
      },
    canDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      }
    },
    {
        "timestamps":false
    }
);

User.belongsToMany(Feed,{through : UserFeeds})
Feed.belongsToMany(User,{through : UserFeeds})

module.exports = { User, UserFeeds };