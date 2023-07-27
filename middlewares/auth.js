const jwt = require("jsonwebtoken");
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;


//An Authentication middleware 
const isAuthenticated =  (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // IF no auth headers are provided
    // THEN return 401 Unauthorized error
    if (!authHeader) {
      return res.status(401).json({
        error: {
          message: 'Auth headers not provided in the request.'
        }
      });
    }
    const token = authHeader.split(' ')[1];
    // IF token is not provided
    // THEN return 401 Unauthorized error
    if (!token) {
      return res.status(401).json({
        error: {
          message: 'Bearer token missing in the authorization headers.'
        }
      })
    }

    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        return res.status(403).json({
          error: 'Invalid access token provided, please login again.'
        });
      }
      req.userData = user; 
      next();
    });
}

module.exports = isAuthenticated;