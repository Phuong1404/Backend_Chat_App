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

//1. Tạo channel
const CreateChannel = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = String(req.headers['authorization'] || '')

    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, Config.server.token.secret)

    let { listUser, name, avatar } = req.body;
    if (listUser.length < 2) {
        let ListUser = []

        let user1 = await User.findOne({ email: payload.email })
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
                console.log(users)
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
        let user1 = await User.findOne({ email: payload.email })
            .select('_id name avatar email')
            .exec()
            .then((users) => {
                return {
                    _id: users._id,
                    name: users.name,
                    nickname: "",
                    avatar: users.avatar,
                    email: users.email
                }
            })
        ListUser.push(user1)
        for (let item in listUser) {
            let User2 = await User.findOne({ _id: listUser[item] })
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

//2. Lấy Danh sách channel người dùng

//3. Out channel

//4. Sửa tên avartar

//5. Đôi nickname

//6. Cấp role

//7. Tất bật chuông channel

export default {
    CreateChannel
}
