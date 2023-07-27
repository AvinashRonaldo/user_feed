const express = require('express')
const cors = require('cors');
const sequelize = require('./init_db');
const User =require('./models/User').User;



const feedRoutes = require("./routes/feedRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app =express()
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Welcome to my world 404");
})

//Routes
app.use(authRoutes);
app.use(feedRoutes);
app.use(userRoutes);

 
//Models Syncing and Server start
sequelize.sync({backup:false}).then(async() => {
    console.log("Sync success");
    const superAdmin = await User.findOne();
    if(!superAdmin){
        const superAdmin = await User.create({
            name:"SuperAdmin",
            role:"Super Admin",
            email:"superadmin@email.com",
            password:"super"
        });
        console.log("Super Admin Created")
    }
    app.listen(port,() => {
        console.log(`server starting on port ${port}`);
    })
}).catch(err=> {
        console.log(err);
})




