const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) => {
    const authHeader = req.header('authorization') || "";
    if(!authHeader) {
        return next(new Error("You Are Not Authenticated!"));
    } else {
        const token = authHeader.split(" ")[1];
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
            if(err) next(new Error("Invalid Token!"));
            req.user = user;
            next()
        })
    }
}
const verifyTokenAndAuthorization = (req,res,next) => {
    verifyToken(req,res,()=> {
        if(req.user.id == req.params.id || req.user.isAdmin) {
            next();
        } else {
            next(new Error("You Are Not Valid User"));
        }
    })
}
const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req,res,()=> {
        if(req.user.isAdmin) {
            next();
        } else {
            next(new Error("You Are Not Valid User"));
        }
    })
}
module.exports = {
    verifyToken:verifyToken,
    verifyTokenAndAuthorization:verifyTokenAndAuthorization,
    verifyTokenAndAdmin:verifyTokenAndAdmin
};