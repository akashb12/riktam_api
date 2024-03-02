const User = require("../models/User")
const CryptoJS = require('crypto-js');

const registerUser = async (req, res) => {
    try {
        if(!req.body.name || !req.body.email || !req.body.password) {
            throw new Error("Some Field Is Missing")
        }
        let userExists = await User.findOne({email:req.body.email});
        if(userExists) {
            throw new Error("User Already Exists")
        }
    
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET_KEY),
        })
        const savedUser = await newUser.save();
        const {password,...others} = savedUser._doc;
        res.status(201).json(others);
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const updateUser = async (req,res) => {
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.userId,{
            $set:req.body
        },{new:true});
        const {password,...others} = updateUser._doc
        res.status(200).json({others})
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const getAllUsers = async (req,res) => {
    try {
        let users = await User.find({isAdmin:false})
        if(!users || !users.length) res.status(403).json("No Users Found");
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error.message)
    }
}
module.exports = {
    getAllUsers:getAllUsers,
    registerUser:registerUser,
    updateUser:updateUser
}