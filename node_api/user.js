// const { text } = require('body-parser');
const db =require('./db');
const UserSchema = new db.mongoose.Schema({
    // userId:{
    //     type:Number,
    //     required:true,
    // },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    headIcon:String,
    gender:Number
})


module.exports = db.mongoose.model ('user',UserSchema)