const jwt = require('jsonwebtoken');
const {User,UserFeeds} = require("../models/User");
const bcrypt = require('bcrypt');
require('dotenv').config();


async function hashPassword(password) {
 return await bcrypt.hash(password, 10);
}
 
async function validatePassword(plainPassword, hashedPassword) {
 return await bcrypt.compare(plainPassword, hashedPassword);
}
const signup = async(req,res) => {
    try{
    const {name,role,email,password} = req.body;
    const uname = name;
    const user = await User.findOne({where : {name : uname}})
    if(user){
        res.status(404).send("A User with that name already exists");
        return;
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({name:uname,role:role,email:email,password:hashedPassword});
    if(newUser){
        res.status(200).json({message:"New User registered Successfully"});
    }
    }
    catch(err){
        console.log(err);
    }
}

const login = async(req,res) => {
    try{
        const uname = req.body.name;
        const password = req.body.password;
        const user = await User.findOne({where: {name:uname}});
        if(!user){
            res.status(400).json({message:"User does not exist"});
            return;
        }
        const check = await validatePassword(password,user.password);
        if(!check ){
            res.status(400).json({message:"Wrong Credentials"});
            return;
        }
        const payload = {
            role:user.role,
            name:user.name,
            id:user.ID
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2d"});
        res.send(token);
        }
    catch(err){
        console.log(err);
    }
}

module.exports = {signup,login};