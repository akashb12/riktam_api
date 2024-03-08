const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    content:{type:String,trim:true},
    chat:{type:mongoose.Schema.Types.ObjectId,ref:"Chat"},
    type:{type:String,default:"message"}
    
},
{timestamps:true});
module.exports = mongoose.model('Message',MessageSchema)