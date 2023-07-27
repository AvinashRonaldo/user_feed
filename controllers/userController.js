const { User,UserFeeds} = require('../models/User');
const sequelize = require('../init_db');
const compareRoles = require('../helpers/compare');
const bcrypt = require('bcrypt');
const Feed = require('../models/Feed');
const logger = require('../helpers/logger')


async function hashPassword(password) {
 return await bcrypt.hash(password, 10);
}

const getUsers = async(req,res) => {
    try{
        const users = await User.findAll({
            include:{
                model:Feed,
                attributes:["ID","name"],
                through:{attributes:[]}
            }
        });
        logger.info("Users Retrieved");
        return res.status(200).json(users);
    } catch(err){
        console.log(err);
    }
}

const createUser = async(req,res) => {
    try{
        const {name,role,email,password} = req.body;
        const newRole = role;
        const uname = name;
        if (compareRoles(req.userData.role,newRole) == false) {
            return res.status(403).json({ error: 'Permission denied' });
        }
        const user = await User.findOne({where : {name : uname}})
        if(user){
            logger.info("User Already exist");
            return res.status(403).send("A User with that name already exists");
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({name:uname,role:role,email:email,password:hashedPassword});
        if(newUser){
            logger.info("User Created");
            return res.status(200).json({message:"New User created Successfully"});
        }
    } catch(err){
        console.log(err);
    }
}

const updateUser = async(req,res) => {
    try{
        const {userId} = req.params;
        const payload = req.body;
        if (req.userData.role =='Admin' || req.userData.role =='Basic') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        const user = await User.findByPk(userId);
        Object.assign(user, payload);
        await user.save();
    } catch(err){
        console.log(err);
    }
}


const deleteUser = async(req,res) => {
    try{
        const {userId} = req.params;
        if (compareRoles(req.userData.role,role) == false) {
            return res.status(403).json({ error: 'Permission denied' });
        }
        const user = await User.findByPk(userId);
        await user.setFeeds([]);
        await user.destroy();
        logger.info("User Deleted");
        res.status(200).json({message:"User deleted successfully"});
    } catch(err){
        console.log(err);
    }
}


const grantAccessToFeed = async(req,res) => {
    try{
        const {userId,feedId} = req.params;
        const user = await User.findByPk(userId);
        const feed = await Feed.findByPk(feedId);
        if(!user || !feed){
            logger.info("Users or Feed do not exist");
            return res.status(403).send("User or Feed do not exist");
        }
        if (compareRoles(req.userData.role,user.role) == false) {
            return res.status(403).json({ error: 'Permission denied' });
        }
        await feed.addUser(user);
        const updatedFeed = await Feed.findByPk(feedId);
        logger.info("User has granted access to feed");
        res.status(200).json({message:updatedFeed});
    } catch(err){
        console.log(err);
    }
}

const removeAccessToFeed = async(req,res) => {
    try{
        const {userId,feedId} = req.params;
        const user = await User.findByPk(userId);
        const feed = await Feed.findByPk(feedId);
        if(!user || !feed){
            logger.info("User or Feed do not exist");
            return res.status(403).send("User or Feed do not exist");
        }
        if (compareRoles(req.userData.role,user.role) == false) {
            return res.status(403).json({ error: 'Permission denied' });
        }
        const result =  await feed.removeUser(user);
        if(result==0){
            logger.info("User has no access");
           return res.status(400).json({ error: 'User do not have access before to the specified feed' });
        }
        const updatedFeed = await Feed.findByPk(feedId);
        logger.info("User has his access removed to the feed");
        res.status(200).json({message:updatedFeed});
    } catch(err){
        console.log(err);
    }
}

const grantDeleteAccessToAdmin = async(req,res)=> {
    try {
        const { userId, feedId } = req.params;
        if (req.userData.role !== 'Super Admin') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        const user = await User.findByPk(userId);
        const feed = await Feed.findByPk(feedId);
        if (!user || !feed) {
            logger.info("User or Feed not found");
        return res.status(404).json({ error: 'User or Feed not found' });
        }
        // Create or update the UserFeed entry to grant delete access
        const [userFeed, created] = await UserFeeds.findOrCreate({
            where: { userID: userId, feedID: feedId },
        });
        userFeed.canDelete = true;
        await userFeed.save();
        logger.info("Delete access granted to feed");
        return res.status(200).json({ message: 'Delete access granted to admin on feed' });
    } catch (err) {
        console.error(err);
    }
}
 
const getLogs = async(req,res) => {
    const logFilePath = path.join(__dirname, 'logs');
    fs.readdir(logFilePath, (err, files) => {
    if (err) {
        logger.info("Error");
        console.error('Error reading logs from directory:', err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
    const logFiles = files.filter((file) => file.startsWith('app_'));
    const logs = [];
    // Read each log file and extract its content
    logFiles.forEach((file) => {
      const logData = fs.readFileSync(path.join(logFilePath, file), 'utf8');
      logs.push(...logData.split('\n'));
    });
    logger.info("Reading logs");
    return res.status(200).json(logs);
  });
}
module.exports = {getUsers,updateUser,deleteUser,
    createUser,grantAccessToFeed,getLogs,
    removeAccessToFeed,grantDeleteAccessToAdmin};