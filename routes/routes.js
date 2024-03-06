const express = require('express');
const {login, logout, searchUsers, getUsersForGroup} = require('../controllers/userController'); 
const {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken} = require('../middleware/auth');
const { getAllUsers, registerUser, updateUser } = require('../controllers/adminController');
const { createGroupChat, fetchUserChats, updateUsersInGroup } = require('../controllers/chatController');
const router = express.Router();

// auth routes
router.post('/user/login',login);
router.post('/user/logout',logout);
router.get('/user/getUsers',verifyToken,getUsersForGroup);

// admin routes
router.post('/admin/register',verifyTokenAndAdmin,registerUser);
router.put('/admin/updateUser/:userId',verifyTokenAndAdmin,updateUser);
router.get('/admin/getAllUsers',verifyTokenAndAdmin,getAllUsers);

//chat routes
// router.post('/chat/create',verifyToken,);
// router.get('/chat/get',verifyToken,);
router.post('/chat/createGroup',verifyToken,createGroupChat);
router.get('/chat/fetchChats',verifyToken,fetchUserChats);
router.put('/chat/updateGroup/:id',verifyToken,updateUsersInGroup);


module.exports = router;