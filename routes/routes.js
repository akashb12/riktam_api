const express = require('express');
const {login, logout} = require('../controllers/userController'); 
const {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken} = require('../middleware/auth');
const { getAllUsers, registerUser, updateUser } = require('../controllers/adminController');
const router = express.Router();

// auth routes
router.post('/user/login',login);
router.post('/user/logout',logout);

// admin routes
router.post('/admin/register',verifyTokenAndAdmin,registerUser);
router.post('/admin/updateUser/:userId',verifyTokenAndAdmin,updateUser);
router.get('/admin/getAllUsers',verifyTokenAndAdmin,getAllUsers);

module.exports = router;