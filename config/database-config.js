const mongoose=require('mongoose');
const dotenv = require("dotenv").config();

const mongoURI=process.env.mongoURI;

const connect=async()=>{
    await mongoose.connect(mongoURI);
}

module.exports=connect;
