const { User,UserFeeds} = require('../models/User');
const Feed = require('../models/Feed');
const logger = require('../helpers/logger');


const getFeeds = async(req,res) => {
    try{
        const userId = req.userData.id;
        const user = await User.findByPk(userId);
        const feeds = await user.getFeeds();
        logger.info("Retrieving Feeds");
        res.status(200).json({message:feeds});
    } catch(err){
        console.log(err);
    }
}
const createFeed = async(req,res)=> {
    try{
        const uname = req.body.name;
        const check = await Feed.findOne({where:{name:uname}});
        if(check){
            logger.info("Feed already existss");
            return res.status(400).json({error:"A Feed with that name exists!"})
        }
        const userId = req.userData.id;
        const user = await User.findByPk(userId);
        const feed = await Feed.create(req.body);
        await feed.addUser(user);
        logger.info("Feed created");
        res.status(200).json({message:`Feed created with ${feed.ID}`});
    } catch(err){
        console.log(err);
    }
}

const deleteFeed = async(req,res)=> {
    try{
        const feedId = req.params.feedId;
        const userId = req.userData.id;
        const feed = await Feed.findByPk(feedId);
        if(!feed){
            logger.info("Feed not present");
            return res.status(400).json({error:"Feed not present"})
        }
        const userFeed = await UserFeeds.findOne({
            where: {
                userID: userId,
                feedID: feedId,
                canDelete: true,
            },
        });
        if (!userFeed && userId!=1) {
            logger.info("No Delete Access to Feed");
            return res.status(403).json({ error: 'Admin does not have delete access to the feed' });
        }
        await feed.setUsers([]);
        const deletedFeed = await Feed.destroy({ where: { id: feedId } });
        if (!deletedFeed) {
            logger.info("Feed not present");
            return res.status(404).json({ error: 'Feed not found' });
        }
        logger.info("Feed deleted");
        return res.status(200).json({ message: 'Feed deleted successfully' });
    } catch(err){
        console.log(err);
    }
}

const updateFeed = async(req,res) => {
    try{
        const {feedId} = req.params;
        const payload = req.body;
        const feed = await Feed.findByPk(feedId);
        if(!feed){
            logger.info("Feed not present");
            return res.status(401).json({error:"Feed not present"})
        }
        Object.assign(feed,payload);
        await feed.save();
        logger.info("Feed updated");
        res.status(200).json({message:"Feed updated successfully"})
    } catch(err){
        console.log(err);
    }
}


module.exports = {createFeed,deleteFeed,updateFeed,getFeeds};