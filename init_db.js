require('dotenv').config();
const Sequelize = require("sequelize");

//Initialise db
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      dialect: 'sqlite',
      storage:'./user.sqlite',
      logging:false
    }
  );

//Establish Connection to db
sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

module.exports = sequelize;

