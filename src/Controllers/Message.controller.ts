import { NextFunction, Request, Response } from "express";
import logging from "../Config/logging";
import Config from "../Config/config";
import User from "../Models/User.model"
import Channel from "../Models/Channel.model";
import Message from "../Models/Message.model"
import * as jwt from 'jsonwebtoken';
import moment = require("moment");

const NAMESPACE = "Message"

const FindExist = (arr, id) => {
    for (let item in arr) {
        if (arr[item]['_id'] == id) {
            return item
        }
    }
    return -1
}

//1. Get chat in room
const GetChat = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = String(req.headers['authorization'] || '')

    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, Config.server.token.secret)
    // let { channel_id } = req.body
    let channel_id = req.params.id
    let limit = String(req.query.limit)
    let page = String(req.query.page)
    if (channel_id) {
        let channel = await Channel.findOne({ _id: channel_id })
            .select('nickname name avatar show_from')
            .exec()
            .then((channel) => {
                return channel
            })
        if (FindExist(channel['nickname'], payload.id) == -1) {
            return res.status(401).json({
                message: "You aren't in the channel"
            })
        }
        else {
            let ListMessage
            if (limit != "undefined" && page != "undefined") {
                if (FindExist(channel['show_from'], payload.id) == -1) {
                    ListMessage = Message.find({ $and: [{ channel_id: channel_id }, { visible_to: { $nin: [payload.id] } }] })
                        .sort({ time: -1 })
                        .skip((parseInt(page) - 1) * 30)
                        .limit(parseInt(limit))
                        .exec()
                        .then((mess) => {
                            return mess
                        });
                }
                else {
                    let index = FindExist(channel['show_from'], payload.id)
                    ListMessage = Message.find({
                        $and: [{ channel_id: channel_id }
                            , { visible_to: { $nin: [payload.id] } }
                            , { time: { $gte: channel.show_from[index]['_id'] } }]
                    })
                        .sort({ time: -1 })
                        .skip((parseInt(page) - 1) * 30)
                        .limit(parseInt(limit))
                        .exec()
                        .then((mess) => {
                            return mess
                        });
                }
            }
            else {
                if (FindExist(channel['show_from'], payload.id) == -1) {
                    ListMessage = await Message.find({ $and: [{ channel_id: channel_id }, { visible_to: { $nin: [payload.id] } }] })
                        .sort({ time: -1 })
                        .skip(0)
                        .limit(30)
                        .exec()
                        .then((mess) => {
                            return mess
                        });
                }
                else {
                    let index = FindExist(channel['show_from'], payload.id)
                    ListMessage = Message.find({
                        $and: [{ channel_id: channel_id }
                            , { visible_to: { $nin: [payload.id] } }
                            , { time: { $gte: channel.show_from[index]['_id'] } }]
                    })
                        .sort({ time: -1 })
                        .skip(0)
                        .limit(30)
                }
            }
            return res.status(200).json({
                channel: {
                    id: channel_id,
                    nickname: channel.nickname,
                    name: channel.name,
                    avatar: channel.avatar
                },
                count_channel: 1,
                message: ListMessage,
                count_message: ListMessage.length
            })
        }
    }
    else {
        return res.status(401).json({
            message: 'Can not get message from channel not found'
        })
    }


}

//2. Send message
const SendMessage = async (req: Request, res: Response, next: NextFunction) => {
    let { content, foward } = req.body
    let channel_id = req.params.id
    let ListFile = req.body.file

    const authHeader = String(req.headers['authorization'] || '')

    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, Config.server.token.secret)

    let user = await User.findOne({ _id: payload.id })
        .select('_id name avatar')
        .exec()
        .then((users) => {
            return users
        })

    let _Message = new Message({
        content: content,
        user: user,
        time: moment(),
        channel_id: channel_id,
        foward: foward,
        status: 0,//0.gửi 1.gỡ
        status_name: 'send',
        time_create: moment()
    })
    return _Message
        .save()
        .then((message) => {
            logging.info(NAMESPACE, 'Send message success')
            return res.status(201).json({
                message
            })
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        })
}

//3. React icon
const ReactIcon = async (req: Request, res: Response, next: NextFunction) => {
    const message_id = req.params.message_id
    let { emoji } = req.body
    const authHeader = String(req.headers['authorization'] || '')

    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, Config.server.token.secret)

    let mess = await Message.findOne({ _id: message_id })
        .select('_id react')
        .exec()
        .then((msg) => {
            return msg
        })
    let ListReact = []
    ListReact = mess.react
    if (mess.react.findIndex((val) => val['user_id'] == payload._id) != -1) {
        if (mess.react.findIndex((val) => val['emoji'] == emoji) != -1) {
            const a1 = mess.react.slice(0, mess.react.findIndex((val) => val['user_id'] == payload._id));
            const a2 = mess.react.slice(mess.react.findIndex((val) => val['user_id'] == payload._id) + 1, mess.react.length);
            ListReact = a1.concat(a2);
        }
        else {
            const a1 = mess.react.slice(0, mess.react.findIndex((val) => val['user_id'] == payload._id));
            const a2 = mess.react.slice(mess.react.findIndex((val) => val['user_id'] == payload._id) + 1, mess.react.length);
            ListReact = a1.concat(a2);
            ListReact.push({
                user_id: payload._id,
                emoji: emoji
            })
        }
    }
    else {
        ListReact.push({
            user_id: payload._id,
            emoji: emoji
        })
    }
    Message.findOneAndUpdate({ _id: message_id }, { react: ListReact })
        .then(() => {
            logging.info(NAMESPACE, 'React message success')
            return res.status(201).json({
                message: "Done"
            })
        })
}

//4. Delete message
const DeleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    const message_id = req.params.message_id
    const authHeader = String(req.headers['authorization'] || '')

    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, Config.server.token.secret)

    let mess = await Message.findOne({ _id: message_id })
        .select('_id visible_to')
        .exec()
        .then((msg) => {
            return msg
        })
    let ListVisible = []
    ListVisible = mess.visible_to
    if (mess.visible_to.findIndex((val) => val == payload.id) == -1) {
        ListVisible.push(payload.id)
        Message.findByIdAndUpdate({ _id: message_id }, { visible_to: ListVisible })
            .then(() => {
                logging.info(NAMESPACE, 'Delete message success')
                return res.status(201).json({
                    message: "Done"
                })
            })
    }
}
//5. Remove message
const RemoveMessage = async (req: Request, res: Response, next: NextFunction) => {
    const message_id = req.params.message_id
    const authHeader = String(req.headers['authorization'] || '')

    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, Config.server.token.secret)

    let mess = await Message.findOne({ _id: message_id })
        .select('_id user')
        .exec()
        .then((msg) => {
            return msg
        })
    if (payload.id == mess.user['_id']) {
        Message.findByIdAndUpdate({ _id: message_id }, { status: 1, status_name: 'Remove' })
            .then(() => {
                logging.info(NAMESPACE, 'Remove message success')
                return res.status(201).json({
                    message: "Done"
                })
            })
    }
}

export default {
    SendMessage, GetChat, ReactIcon, DeleteMessage, RemoveMessage
}
