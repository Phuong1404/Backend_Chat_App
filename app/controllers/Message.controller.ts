import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose';
import Message from '../models/Message.model'
import Channel from "../models/Channel.model";
import Attachment from '../models/Attachment.model'
import User from '../models/User.model'
import * as cloudinary from 'cloudinary'
//1.Lấy tất cả tin nhắn trong 1 channel
//Nếu có trong invisible ko hiện
const getMessageInChannel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) * 1 || 1;
        const limit = Number(req.query.limit) * 1 || 10;
        const skip = (page - 1) * limit;

        const channel_id = req.params.id
        const channel = await Channel.findById(channel_id)
        if (!channel) {
            return res.status(400).json({ message: "Channel not found" })
        }
        const is_MyChannel = channel.user.find(user => String(user) == String(req.user['_id']))
        if (!is_MyChannel) {
            res.status(400).json({ message: "This not your channel" })
        }
        const message = await Message.find({ channel: String(channel_id) })
            .sort("-createdAt")
            .populate("attachment")
            .skip(skip)
            .limit(limit)
        const List_Message = []
        for (let mess in message) {
            let is_delete = message[mess].invisible_to.find(user => String(user) == String(req.user['_id']))
            if (!is_delete) {
                List_Message.push(message[mess])
            }
        }
        res.json({ data: List_Message })
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
        const is_user = channel.user.findIndex(user => String(user) == String(req.user['_id']))
        console.log(channel.user)
        let unread = channel.user.splice(is_user, 1)
        //-----------Setup_file------------------------------
        //Cần định dạng lại file
        const fileAttachment = req.file
        let file_name, format_type, size = ""
        if (fileAttachment) {
            console.log(fileAttachment)
            file_name = fileAttachment.filename
            format_type = fileAttachment.mimetype
            size = String(fileAttachment.size)
        }

        const newAttachment = new Attachment({
            _id: new mongoose.Types.ObjectId(),
            name: file_name,
            size: size,
            format_type: format_type,
        })
        //----------------------------------------------------

        if (fileAttachment) {
            const newMessage = new Message({
                _id: new mongoose.Types.ObjectId,
                user: req.user['_id'],
                status: 0,
                status_name: "Active",
                reply: reply,
                channel: channel_id,
                content: content,
                attachment: newAttachment._id,
                unread: unread
            })
            await newMessage.save()
            await newAttachment.save();

            //---------------------------------------------------
            cloudinary.v2.uploader.upload(fileAttachment.path).then(async (result) => {
                await Attachment.findByIdAndUpdate(
                    { _id: newAttachment._id },
                    {
                        link: result.url,
                        user: req.user['_id'],
                        res_model: "Message",
                        res_id: newMessage._id
                    }
                )
            })
            res.json({ data: newMessage })
            //---------------------------------------------------
        }
        else {
            const newMessage = new Message({
                _id: new mongoose.Types.ObjectId,
                user: req.user['_id'],
                status: 0,
                status_name: "Active",
                reply: reply,
                channel: channel_id,
                content: content,
                unread: unread
            })
            await newMessage.save()
            res.json({ data: newMessage })
        }
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
        return res.json({ message: "Remove success" })
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
        let is_delete = message.invisible_to.find(user => String(user) == String(req.user['_id']))
        if (is_delete) {
            return res.json({ message: "Was delete" })
        }
        await Message.findByIdAndUpdate({ _id: message_id }, {
            $push: { invisible_to: req.user['_id'] }
        })
        return res.json({ message: "Delete success" })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
//5.React tin nhắn
const reactMessage = async (req: Request, res: Response, next: NextFunction) => {
    const message_id = req.params.id
    const { emoji } = req.body
    const message = await Message.findById(message_id)
    if (!message) {
        res.status(400).json({ message: "Message not exist" })
    }
    if (String(message.user) != String(req.user['_id'])) {
        res.status(400).json({ message: "Message is not your" })
    }
    const react = {
        user: req.user['_id'],
        emoji: emoji
    }
    await Message.findByIdAndUpdate({ _id: message_id }, {
        $push: { react: react }
    })
    return res.json({ message: "React succsess" })
}
//6. Read message in channel
const readMessage = async (req: Request, res: Response, next: NextFunction) => {
    const channel_id = req.params.id
    const channel = await Channel.findById(channel_id)
    if (!channel) {
        return res.status(400).json({ message: "Channel not found" })
    }
    const is_MyChannel = channel.user.find(user => String(user) == String(req.user['_id']))
    if (!is_MyChannel) {
        res.status(400).json({ message: "This not your channel" })
    }
    const messages = await Message.find({ channel: String(channel_id) })

    for (let mess in messages) {
        let is_unread = messages[mess].unread.find(user => String(user) == String(req.user['_id']))
        if (is_unread) {
            await Message.findByIdAndUpdate({ _id: req.user['_id'] },
                {
                    $pull: { unread: req.user['_id'] }
                })
        }
    }
    res.json({ message: "Done" })
}
export default {
    getMessageInChannel, deleteMessage, removeMessage, chatMessageInChannel, reactMessage, readMessage
}
