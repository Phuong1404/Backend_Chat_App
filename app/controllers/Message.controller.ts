import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose';
import Message from '../models/Message.model'
import Channel from "../models/Channel.model";
import User from '../models/User.model'
//1.Lấy tất cả tin nhắn trong 1 channel
//Nếu có trong invisible ko hiện
const getMessageInChannel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const channel_id = req.params.id
        const channel = await Channel.findById(channel_id)
        if (!channel) {
            return res.status(400).json({ message: "Channel not found" })
        }
        const is_MyChannel = channel.user.find(user => String(user) == String(req.user['_id']))
        if (!is_MyChannel) {
            res.status(400).json({ message: "This not your channel" })
        }
        const message = await Message.find({ channel: channel_id })

        res.json({ data: message })
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
//2.Nhắn tin vào 1 channel
const chatMessageInChannel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const channel_id = req.params.id
        const { content, reply } = req.body
        const channel = await Channel.findById(channel_id)
        if (!channel) {
            return res.status(400).json({ message: "Channel not found" })
        }
        const is_MyChannel = channel.user.find(user => String(user) == String(req.user['_id']))
        if (!is_MyChannel) {
            res.status(400).json({ message: "This not your channel" })
        }
        const newMessage = new Message({
            _id: mongoose.Types.ObjectId,
            user: req.user['_id'],
            status: 0,
            status_name: "Active",
            reply: reply,
            channel: channel_id
        })
        newMessage.save()
        res.json({ data: newMessage })
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
//3.Gỡ tin nhắn
const removeMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message_id = req.params.id
        const message = await Message.findById(message_id)
        if (!message) {
            res.status(400).json({ message: "Message not exist" })
        }
        if (String(message.user) != String(req.user['_id'])) {
            res.status(400).json({ message: "Message is not your" })
        }
        await Message.findByIdAndUpdate({ _id: message_id }, {
            status: 1,
            status_name: "Remove"
        })
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
//4.Xóa tin nhắn
const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message_id = req.params.id
        const message = await Message.findById(message_id)
        if (!message) {
            res.status(400).json({ message: "Message not exist" })
        }
        if (String(message.user) != String(req.user['_id'])) {
            res.status(400).json({ message: "Message is not your" })
        }
        await Message.findByIdAndUpdate({ _id: message_id }, {
            $push: { invisible_to: req.user['_id'] }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
//5.React tin nhắn

export default {
    getMessageInChannel, deleteMessage, removeMessage, chatMessageInChannel
}
