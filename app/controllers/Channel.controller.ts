import { NextFunction, Request, Response } from "express";
import mongoose, { model } from 'mongoose';
import Channel from '../models/Channel.model'
import User from '../models/User.model'
import Attachment from "../models/Attachment.model";
import Message from "../models/Message.model";

//1. Create Channel
const createChannel = async (req: Request, res: Response, next: NextFunction) => {
    const { list_user, name } = req.body
    if (list_user.length < 2) {
        return res.status(400).json({ message: "You cannot create a channel with less than 3 members" })
    }
    let user_channel = []
    user_channel.push(String(req.user['_id']))
    for (let user in list_user) {
        user_channel.push(list_user[user])
    }
    const newChannel = new Channel({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        user: user_channel,
        num_member: user_channel.length
    })
    await newChannel.save()
    for (let user in user_channel) {
        await User.findByIdAndUpdate({ _id: user_channel[user] }, {
            $push: { channel: newChannel._id }
        })
    }
    res.json({ data: newChannel })
}
//2. Add User(s) to Channel
const addUserToChannel = async (req: Request, res: Response, next: NextFunction) => {
    const channel_id = req.params.id
    const channel = await Channel.findById(channel_id)
    if (!channel) {
        return res.status(400).json({ message: "Channel not found" })
    }
    const is_MyChannel = channel.user.find(user => String(user) == String(req.user['_id']))
    if (!is_MyChannel) {
        res.status(400).json({ message: "This not your channel" })
    }
    const { list_user } = req.body
    let user_channel = []
    for (let user in list_user) {
        let is_In_Channel = channel.user.find(user1 => String(user1) == String(list_user[user]))
        if (!is_In_Channel) {
            user_channel.push(list_user[user])
        }
    }
    await Channel.findByIdAndUpdate({ _id: channel_id }, {
        $push: { user: user_channel },
        num_member: channel.num_member + user_channel.length
    })
    for (let user in user_channel) {
        await User.findByIdAndUpdate({ _id: user_channel[user] }, {
            $push: { channel: channel_id }
        })
    }
    res.json({ message: "Add success" })
}
//3. Delete User(s) to Channel
const removeUserToChannel = async (req: Request, res: Response, next: NextFunction) => {
    const channel_id = req.params.id
    const channel = await Channel.findById(channel_id)
    if (!channel) {
        return res.status(400).json({ message: "Channel not found" })
    }
    const is_MyChannel = channel.user.find(user => String(user) == String(req.user['_id']))
    if (!is_MyChannel) {
        res.status(400).json({ message: "This not your channel" })
    }
    const { list_user } = req.body
    let user_channel = []
    for (let user in list_user) {
        let is_In_Channel = channel.user.find(user1 => String(user1) == String(list_user[user]))
        if (is_In_Channel) {
            user_channel.push(list_user[user])
        }
    }
    for (let user in user_channel) {
        await Channel.findByIdAndUpdate({ _id: channel_id }, {
            $pull: { user: user_channel[user] },
            num_member: channel.num_member - user_channel.length
        })
        await User.findByIdAndUpdate({ _id: user_channel[user] }, {
            $pull: { channel: channel_id }
        })
    }
    res.json({ message: "Delete success" })
}
//4. Update Channel
const updateChannel = async (req: Request, res: Response, next: NextFunction) => {
    const channel_id = req.params.id
    const { name } = req.body
    const channel = await Channel.findById(channel_id)
    if (!channel) {
        return res.status(400).json({ message: "Channel not found" })
    }
    const is_MyChannel = channel.user.find(user => String(user) == String(req.user['_id']))
    if (!is_MyChannel) {
        res.status(400).json({ message: "This not your channel" })
    }
    await Channel.findByIdAndUpdate({ _id: channel_id }, {
        name: name,
        avatar: ""
    })
    res.json({ message: "Update success" })
}
//5. Get DataChannel
const getChannel = async (req: Request, res: Response, next: NextFunction) => {
    const channel_id = req.params.id
    const channel = await Channel.findById(channel_id)
        .populate("user", "_id name avatar")
        .populate("attachment")
        .populate("avatar", "-_id link")
    const populateQuery = [
        {
            path: 'user.avatar',
            select: '-_id link',
        },
    ];
    
    if (!channel) {
        return res.status(400).json({ message: "Channel not found" })
    }
    const channel1 = await Channel.populate(channel, populateQuery);
    res.json({ data: channel1 })
}
//6. Leave Channel
const leaveChannel = async (req: Request, res: Response, next: NextFunction) => {
    const channel_id = req.params.id
    const channel = await Channel.findById(channel_id)
    if (!channel) {
        return res.status(400).json({ message: "Channel not found" })
    }
    const is_MyChannel = channel.user.find(user => String(user) == String(req.user['_id']))
    if (!is_MyChannel) {
        res.status(400).json({ message: "This not your channel" })
    }
    if (channel.num_member <= 2) {
        res.status(400).json({ message: "You cannot leave channel" })
    }
    await Channel.findByIdAndUpdate({ _id: channel_id }, {
        $pull: { user: req.user['_id'] },
        num_member: channel.num_member - 1
    })
    res.json({ message: "Leave channel success" })
}
//7. Get My List Channel
const MyListChannel = async (req: Request, res: Response, next: NextFunction) => {
    const listChannel = await Channel.find({ user: { $all: [req.user['_id']] } })
    let ListValue = []
    for (let i in listChannel) {
        let mess_unread = 0;
        let lasttime = ""
        let last_mess
        let last = 0
        const messchannel = await Message.find({ channel: listChannel[i].id })
        for (let mess in messchannel) {
            let is_unread = messchannel[mess].unread.find(user => String(user) == String(req.user['_id']))
            if (is_unread) {
                mess_unread = mess_unread + 1
            }
            if (messchannel[mess].get('createdAt').getTime() > last) {
                last = messchannel[mess].get('createdAt').getTime()
                lasttime = messchannel[mess].get('createdAt')
                last_mess = messchannel[mess]
            }
        }
        if (listChannel[i].num_member == 2) {
            if (messchannel.length > 0) {
                const user_id = listChannel[i].user.find(user => String(user) != String(req.user['_id']))
                const user_channel = await User.findOne({ _id: user_id })

                let avatar = ""
                if (user_channel) {
                    if (user_channel.get('avatar')) {
                        const attachment = await Attachment.findOne({ _id: user_channel.avatar })
                        if (attachment) {
                            avatar = attachment.link
                        }
                    }
                    const val = {
                        "_id": listChannel[i]._id,
                        "name": user_channel.name,
                        "avatar": avatar,
                        "user": [{
                            "_id": user_channel._id,
                            "name": user_channel.name,
                            "avatar": avatar
                        }],
                        "num_member": listChannel[i].num_member,
                        "unread": mess_unread,
                        "last_message_time": lasttime,
                        "last_message": last_mess,
                    }
                    ListValue.push(val)
                }
            }
        }
        else {
            listChannel[i].user.shift()
            let List_User = []
            for (let u in listChannel[i].user) {
                const user_channel = await User.findOne({ _id: listChannel[i].user[u] })
                let avatar = ""
                if (user_channel) {
                    if (user_channel.get('avatar')) {
                        const attachment = await Attachment.findOne({ _id: user_channel.avatar })
                        if (attachment) {
                            avatar = attachment.link
                        }
                    }

                    const val_user = {
                        "_id": listChannel[i].user[u],
                        "name": user_channel.name,
                        "avatar": avatar
                    }
                    List_User.push(val_user)
                }
            }
            const val = {
                "_id": listChannel[i]._id,
                "name": listChannel[i].name,
                "avatar": "",
                "user": List_User,
                "num_member": listChannel[i].num_member,
                "unread": mess_unread,
                "last_message_time": lasttime,
                "last_message": last_mess,
            }
            ListValue.push(val)
        }
    }
    res.json(ListValue)
}
export default {
    leaveChannel, createChannel, updateChannel, addUserToChannel, removeUserToChannel, getChannel, MyListChannel
}
