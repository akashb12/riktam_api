const express = require('express');
const {login} = require('../controllers/userController'); 
const {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken} = require('../middleware/auth');
const { getAllUsers, registerUser } = require('../controllers/adminController');
const router = express.Router();

// auth routes
router.post('/user/login',login);

// admin routes
router.post('/user/register',verifyTokenAndAdmin,registerUser);
router.get('/admin/getAllUsers',verifyTokenAndAdmin,getAllUsers);

module.exports = router;