const express = require('express');
const router = express.Router();
const feedController = require("../controllers/feedController");
const isAuthenticated = require('../middlewares/auth');

//get Feeds of respective users
router.get("/feeds/all",isAuthenticated,feedController.getFeeds);

//create a new Feed
router.post("/feed/create",isAuthenticated,feedController.createFeed);

//update Feed details
router.put("/feed/:feedId",isAuthenticated,feedController.updateFeed);

//Delete feed
router.delete("/feed/:feedId",isAuthenticated,feedController.deleteFeed);
 
module.exports = router;