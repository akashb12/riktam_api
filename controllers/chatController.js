const Chat = require("../models/Chat");
const User = require("../models/User");
const Message = require('../models/Message')

const createGroupChat = async(req,res) => {
   try {
    if(!req.body.users || ! req.body.name) {
        throw new Error('Please Fill All Fields');
    }
    let users = JSON.parse(req.body.users).map((item) => item._id);
    users.push(req.user.id);
    if(users.length < 2) {
        throw new Error('Atleast 2 users are required for group chat');
    }
    const newGroup = new Chat({
        chatName:req.body.name,
        users:users,
        isGroupChat:true,
        groupAdmin:req.user.id
    })
    const createGroup = await newGroup.save();
    const getGroupChat = await Chat.findOne({_id:createGroup._id}).populate("users","-password").populate('groupAdmin','-password');
    res.status(201).json(getGroupChat);
   } catch (error) {
    res.status(500).json(error.message)
   }
}

const fetchUserChats = async (req, res) => {
    try {
        const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
        .populate("users", "-password")
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })
        .then(async(results) =>{
            results = await User.populate(results,{
                path:'latestMessage.sender',
                select:'name pic email'
            })
            res.status(200).json(results);
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const updateUsersInGroup = async (req, res) => {
    try {
        if(!req.body.users) {
            throw new Error('No users found');
        }
        let users = JSON.parse(req.body.users).map((item) => item._id);
        users.push(req.user.id);
        if(users.length < 2) {
            throw new Error('Atleast 2 users are required for group chat');
        }
        const add = await Chat.findByIdAndUpdate(req.params.chatId,
            { users: users }, { new: true }).populate('users', '-password').populate('groupAdmin', 'password');
        res.status(200).json(add);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const deleteGroup = async (req,res) => {
    try {
        await Chat.findByIdAndDelete(req.params.chatId);
        res.status(204).json('Chat deleted');
    } catch (error) {
        res.status(500).json(error.message);
    }
}
module.exports={
    createGroupChat:createGroupChat,
    fetchUserChats:fetchUserChats,
    updateUsersInGroup:updateUsersInGroup,
    deleteGroup:deleteGroup
}