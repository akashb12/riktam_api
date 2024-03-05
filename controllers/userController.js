const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        let user = await User.findOne({email:req.body.email});
        if(!user) {
            throw new Error('Wrong Credentials!')
        }
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET_KEY);
        const decryptPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
        if(req.body.password != decryptPassword){
            throw new Error('Wrong Credentials!')
        }
        const accessToken = jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin
        },process.env.JWT_SECRET_KEY,{expiresIn:'3d'})
        const {password,...others} = user._doc;
        res.cookie("token", accessToken, { httpOnly: false, secure: true, sameSite: "none" });
        others.accessToken = accessToken
        res.status(200).json({others})
    } catch (error) {
        res.status(500).json(error.message)
    }
}
const logout = async (req,res) => {
    res.cookie("token", "", { httpOnly: false, secure: true, sameSite: "none" });
    res.status(200).json({ data: "logout successful" });
}

const searchUsers = async (req,res) => {
    try {
        const serachName = req.query.name;
        const users = await User.find({
            $or: [
                { name: { $regex: serachName, $options: "i" } },
                { email: { $regex: serachName, $options: "i" } }
            ]
        }).find({
            _id: { $ne: req.user.id },
            isAdmin:false
        });
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const getUsersForGroup = async (req,res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.user.id },
            isAdmin:false
        });
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error.message)
    }
}
module.exports = {
    login:login,
    logout:logout,
    searchUsers:searchUsers,
    getUsersForGroup:getUsersForGroup
}