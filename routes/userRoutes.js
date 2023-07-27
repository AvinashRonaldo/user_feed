const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const isAuthenticated = require('../middlewares/auth');

//Get all users
router.get("/user/all",isAuthenticated,userController.getUsers);

//get logs
router.get("/logs",isAuthenticated,userController.getLogs);

//Create a new User
router.post("/user/create",isAuthenticated,userController.createUser);
 
//Update user
router.put("/user/:userId",isAuthenticated,userController.updateUser);

//Delete user
router.delete("/user/:userId",isAuthenticated,userController.deleteUser);

//Grant Access of Feed to new User
router.post("/user/:userId/access/:feedId",isAuthenticated,userController.grantAccessToFeed);

//Revoke Access of Feed to User
router.post("/user/:userId/egress/:feedId",isAuthenticated,userController.removeAccessToFeed);


module.exports = router;