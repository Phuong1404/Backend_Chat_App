"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../Config/config");
const User_model_1 = require("../Models/User.model");
const Channel_model_1 = require("../Models/Channel.model");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const NAMESPACE = "Channel";
//1. Tạo channel
const CreateChannel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    let { listUser, name, avatar } = req.body;
    if (listUser.length < 2) {
        let ListUser = [];
        let user1 = yield User_model_1.default.findOne({ email: payload.email })
            .select('_id name avatar')
            .exec()
            .then((users) => {
            return {
                _id: users._id,
                name: users.name,
                nickname: "",
                avatar: users.avatar
            };
        });
        ListUser.push(user1);
        let User2 = yield User_model_1.default.findOne({ _id: listUser[0] })
            .select('_id name avatar')
            .exec()
            .then((users) => {
            console.log(users);
            return {
                _id: users._id,
                name: users.name,
                nickname: "",
                avatar: users.avatar
            };
        });
        ListUser.push(User2);
        let _Channel = new Channel_model_1.default({
            name: "",
            avatar: "",
            time_create: moment(),
            user_create: "System",
            num_member: 2,
            nickname: ListUser
        });
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
        });
    }
    else {
        let ListUser = [];
        let user1 = yield User_model_1.default.findOne({ email: payload.email })
            .select('_id name avatar email')
            .exec()
            .then((users) => {
            return {
                _id: users._id,
                name: users.name,
                nickname: "",
                avatar: users.avatar,
                email: users.email
            };
        });
        ListUser.push(user1);
        for (let item in listUser) {
            let User2 = yield User_model_1.default.findOne({ _id: listUser[item] })
                .select('_id name avatar')
                .exec()
                .then((users) => {
                return {
                    _id: users._id,
                    name: users.name,
                    nickname: "",
                    avatar: users.avatar
                };
            });
            ListUser.push(User2);
        }
        let _Channel = new Channel_model_1.default({
            name: name,
            avatar: avatar,
            time_create: moment(),
            user_create: user1.email,
            num_member: listUser.length,
            nickname: ListUser,
            role: {
                user_id: user1._id,
                name: user1.name,
                kick_member: true,
                add_member: true,
                change_name: true,
                set_role: true
            }
        });
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
        });
    }
});
//2. Lấy Danh sách channel người dùng
//3. Out channel
//4. Sửa tên avartar
//5. Đôi nickname
//6. Cấp role
//7. Tất bật chuông channel
exports.default = {
    CreateChannel
};
//# sourceMappingURL=Channel.controller.js.map