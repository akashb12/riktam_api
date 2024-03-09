const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

const sendMessage = async (req, res) => {
    try {
        const newMessage = new Message({
            sender: req.user.id,
            content: req.body.content,
            chat: req.params.chatId
        })
        let message = await newMessage.save();
        message = await message.populate('sender', 'name pic');
        message = await message.populate('chat');
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email'
        })
        await Chat.findByIdAndUpdate(req.params.chatId, { latestMessage: message })
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const fetchMessages = async (req, res) => {
    try {
        let messages = await Message.find({ chat: req.params.chatId }).populate('sender', 'name pic').populate('chat');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const readMessage = async (req, res) => {
    try {
        let message = await Message.findByIdAndUpdate(req.params.messageId, {
            $push: { readBy: req.user.id },
        },
            {
                new: true,
            }).populate('sender', 'name pic').populate('chat');
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const likeMessage = async (req, res) => {
    try {
        let query = "";
        if (req.query.type == 'like') {
            query = {
                $push: { likedBy: req.user.id }
            }
        } else {
            query = {
                $pull: { likedBy: req.user.id }
            }
        }
        let message = await Message.findByIdAndUpdate(req.params.messageId, query,
            {
                new: true,
            }).populate('sender', 'name pic').populate('chat');
        res.status(200).json(message);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message)
    }
}
module.exports = {
    sendMessage: sendMessage,
    fetchMessages: fetchMessages,
    readMessage: readMessage,
    likeMessage: likeMessage
}