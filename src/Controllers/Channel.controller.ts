import { NextFunction, Request, Response } from "express";
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import logging from "../Config/logging";
import Config from "../Config/config";
import User from '../Models/User.model'
import Channel from "../Models/Channel.model";
import * as jwt from 'jsonwebtoken';
import moment = require("moment");

const NAMESPACE = "Channel"

const FindRole = (arr, id) => {
    for (let item in arr) {
        if (arr[item]['user_id'] == id) {
            return item
        }
    }
    return -1
}
const FindExist = (arr, id) => {
    for (let item in arr) {
        if (arr[item]['_id'] == id) {
            return item
        }
    }
    return -1
}

//1. Tạo channel
const CreateChannel = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = String(req.headers['authorization'] || '')

    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, Config.server.token.secret)

    let { listUser, name, avatar } = req.body;
    if (listUser.length < 2) {
        let ListUser = []

        let user1 = await User.findOne({ _id: payload.id })
            .select('_id name avatar')
            .exec()
            .then((users) => {
                return {
                    _id: users._id,
                    name: users.name,
                    nickname: "",
                    avatar: users.avatar
                }
            })
        ListUser.push(user1)
        let User2 = await User.findOne({ _id: listUser[0] })
            .select('_id name avatar')
            .exec()
            .then((users) => {
                return {
                    _id: users._id,
                    name: users.name,
                    nickname: "",
                    avatar: users.avatar
                }
            })
        ListUser.push(User2)

        let _Channel = new Channel({
            name: "",
            avatar: "",
            time_create: moment(),
            user_create: "System",
            num_member: 2,
            nickname: ListUser
        })
        return _Channel
            .save()
            .then((channel) => {
                return res.status(201).json({
                    channel
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            })
    }
    else {
        let ListUser = []
        let user1 = await User.findOne({ _id: payload.id })
            .select('_id name avatar email channel')
            .exec()
            .then((users) => {
                return {
                    _id: users._id,
                    name: users.name,
                    nickname: "",
                    avatar: users.avatar,
                    email: users.email,
                    channel: users.channel
                }
            })
        ListUser.push(user1)

        for (let item in listUser) {
            let User2 = await User.findOne({ _id: listUser[item] })
                .select('_id name avatar channel')
                .exec()
                .then((users) => {
                    return {
                        _id: users._id,
                        name: users.name,
                        nickname: "",
                        avatar: users.avatar,
                        channel: users.channel
                    }
                })
            console.log(User2)
            ListUser.push(User2)
        }
        let _Channel = new Channel({
            name: name,
            avatar: avatar,
            time_create: moment(),
            user_create: user1.email,
            num_member: listUser.length + 1,
            nickname: ListUser,
            role: {
                user_id: user1._id,
                name: user1.name,
                kick_member: true,
                add_member: true,
                change_name: true,
                set_role: true
            }
        })

        return _Channel
            .save()
            .then((channel) => {
                for (let item in ListUser) {
                    let Val = {
                        _id: channel._id,
                        name: name,
                        avatar: avatar,
                    }
                    let ListCh = []
                    ListCh = ListUser[item].channel
                    console.log(ListCh)
                    ListCh.push(Val)
                    User.findByIdAndUpdate({ _id: ListUser[item]._id }, { channel: ListCh })
                        .then()
                }
                return res.status(201).json({
                    channel
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            })
    }

}

//2. Out channel
const OutChannel = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = String(req.headers['authorization'] || '')

    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, Config.server.token.secret)

    const channel_id = req.params.id

    let user = await User.findOne({ _id: payload.id })
        .select('_id')
        .exec()
        .then((users) => {
            return users
        })

    Channel.findOne({ _id: channel_id })
        .select('nickname')
        .exec()
        .then((channel) => {
            if (channel != null) {
                let index = FindExist(channel.nickname, user._id)
                if (index == -1) {
                    return res.status(401).json({
                        message: "You aren't in the channel"
                    })
                }
                else {
                    let Nickname = channel.nickname.filter((value, index, arr) => {
                        return value['_id'] != user._id
                    })
                    Channel.findByIdAndUpdate({ _id: channel_id }, { nickname: Nickname, num_member: Nickname.length })
                        .then(() => {
                            logging.info(NAMESPACE, 'Out channel success')
                            return res.status(201).json({
                                message: "Done"
                            })
                        })
                }
            }
            else {
                return res.status(401).json({
                    message: "Channel not found"
                })
            }
        })
}

//3. Thêm vào channel
const AddToChannel = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = String(req.headers['authorization'] || '')

    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, Config.server.token.secret)

    const channel_id = req.params.id
    const { list_user } = req.body

    let useradd = await User.findOne({ _id: payload.id })
        .select('_id')
        .exec()
        .then((users) => {
            return users
        })
    let NewUser = []
    for (let i in list_user) {
        let usernew = await User.findOne({ _id: list_user[i] })
            .select('_id name avatar channel')
            .exec()
            .then((users) => {
                return {
                    _id: users._id,
                    name: users.name,
                    nickname: "",
                    avatar: users.avatar,
                    channel: users.channel
                }
            })
        NewUser.push(usernew)
    }

    Channel.findOne({ _id: channel_id })
        .select('nickname role avatar name')
        .exec()
        .then((channel) => {
            if (channel != null) {
                let index = FindRole(channel.role, useradd._id)
                if (index == -1) {
                    return res.status(401).json({
                        message: "You are not in the channel"
                    });
                }
                else {
                    if (channel.role[index]['add_member'] == true) {
                        let nickNameVal = []
                        for (let i in NewUser) {
                            if (FindExist(channel.nickname, NewUser[i]._id) != -1) {
                                return res.status(401).json({
                                    message: "User already exists in the channel"
                                });
                            }
                            else {
                                nickNameVal.push(NewUser[i])
                            }
                        }
                        for (let item in channel.nickname) {
                            nickNameVal.push(channel.nickname[item])
                        }

                        Channel.findByIdAndUpdate({ _id: channel_id }, { nickname: nickNameVal, num_member: nickNameVal.length })
                            .then(() => {
                                for (let item in NewUser) {
                                    let Val = {
                                        _id: channel._id,
                                        name: channel.name,
                                        avatar: channel.avatar,
                                    }
                                    let ListCh = NewUser[item].channel
                                    ListCh.push(Val)
                                    User.findByIdAndUpdate({ _id: NewUser[item]._id }, { channel: ListCh })
                                        .then()
                                }
                                logging.info(NAMESPACE, 'Add user to channel success')
                                return res.status(201).json({
                                    message: "Done"
                                })
                            })
                    }
                    else {
                        return res.status(401).json({
                            message: "You don't have permission"
                        });
                    }
                }
            }
            else {
                return res.status(401).json({
                    message: "Channel not found"
                })
            }
        })
}

//4. Sửa tên avartar

//5. Đổi nickname

//6. Cấp role

//7. Tất bật chuông channel

export default {
    CreateChannel, OutChannel, AddToChannel
}
