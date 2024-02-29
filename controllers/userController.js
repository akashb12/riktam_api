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
        res.status(200).json({others,accessToken})
    } catch (error) {
        res.status(500).json(error.message)
    }
}
module.exports = {
    login:login
}