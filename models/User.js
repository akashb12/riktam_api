const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    email:{type:String,required:true,uinque:true},
    password:{type:String,required:true},
    isAdmin:{type:Boolean,required:true,default:false},
    pic: {
        type: "String",
        required: true,
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      },
},
{timestamps:true});
module.exports = mongoose.model('User',UserSchema)