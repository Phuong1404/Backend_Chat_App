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
const logging_1 = require("../Config/logging");
const config_1 = require("../Config/config");
const User_model_1 = require("../Models/User.model");
const Channel_model_1 = require("../Models/Channel.model");
const Message_model_1 = require("../Models/Message.model");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const NAMESPACE = "Message";
const FindExist = (arr, id) => {
    for (let item in arr) {
        if (arr[item]['_id'] == id) {
            return item;
        }
    }
    return -1;
};
//1. Get chat in room
const GetChat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    // let { channel_id } = req.body
    let channel_id = req.params.id;
    let limit = String(req.query.limit);
    let page = String(req.query.page);
    if (channel_id) {
        let channel = yield Channel_model_1.default.findOne({ _id: channel_id })
            .select('nickname name avatar show_from')
            .exec()
            .then((channel) => {
            return channel;
        });
        if (FindExist(channel['nickname'], payload.id) == -1) {
            return res.status(401).json({
                message: "You aren't in the channel"
            });
        }
        else {
            let ListMessage;
            if (limit != "undefined" && page != "undefined") {
                if (FindExist(channel['show_from'], payload.id) == -1) {
                    ListMessage = Message_model_1.default.find({ $and: [{ channel_id: channel_id }, { visible_to: { $nin: [payload.id] } }] })
                        .sort({ time: -1 })
                        .skip((parseInt(page) - 1) * 30)
                        .limit(parseInt(limit))
                        .exec()
                        .then((mess) => {
                        return mess;
                    });
                }
                else {
                    let index = FindExist(channel['show_from'], payload.id);
                    ListMessage = Message_model_1.default.find({
                        $and: [{ channel_id: channel_id },
                            { visible_to: { $nin: [payload.id] } },
                            { time: { $gte: channel.show_from[index]['_id'] } }]
                    })
                        .sort({ time: -1 })
                        .skip((parseInt(page) - 1) * 30)
                        .limit(parseInt(limit))
                        .exec()
                        .then((mess) => {
                        return mess;
                    });
                }
            }
            else {
                if (FindExist(channel['show_from'], payload.id) == -1) {
                    ListMessage = yield Message_model_1.default.find({ $and: [{ channel_id: channel_id }, { visible_to: { $nin: [payload.id] } }] })
                        .sort({ time: -1 })
                        .skip(0)
                        .limit(30)
                        .exec()
                        .then((mess) => {
                        return mess;
                    });
                }
                else {
                    let index = FindExist(channel['show_from'], payload.id);
                    ListMessage = Message_model_1.default.find({
                        $and: [{ channel_id: channel_id },
                            { visible_to: { $nin: [payload.id] } },
                            { time: { $gte: channel.show_from[index]['_id'] } }]
                    })
                        .sort({ time: -1 })
                        .skip(0)
                        .limit(30);
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
            });
        }
    }
    else {
        return res.status(401).json({
            message: 'Can not get message from channel not found'
        });
    }
});
//2. Send message
const SendMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { content, foward } = req.body;
    let channel_id = req.params.id;
    let ListFile = req.body.file;
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    let user = yield User_model_1.default.findOne({ _id: payload.id })
        .select('_id name avatar')
        .exec()
        .then((users) => {
        return users;
    });
    let _Message = new Message_model_1.default({
        content: content,
        user: user,
        time: moment(),
        channel_id: channel_id,
        foward: foward,
        status: 0,
        status_name: 'send',
        time_create: moment()
    });
    return _Message
        .save()
        .then((message) => {
        logging_1.default.info(NAMESPACE, 'Send message success');
        return res.status(201).json({
            message
        });
    })
        .catch((error) => {
        return res.status(500).json({
            message: error.message,
            error
        });
    });
});
//3. React icon
const ReactIcon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const message_id = req.params.message_id;
    let { emoji } = req.body;
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    let mess = yield Message_model_1.default.findOne({ _id: message_id })
        .select('_id react')
        .exec()
        .then((msg) => {
        return msg;
    });
    let ListReact = [];
    ListReact = mess.react;
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
            });
        }
    }
    else {
        ListReact.push({
            user_id: payload._id,
            emoji: emoji
        });
    }
    Message_model_1.default.findOneAndUpdate({ _id: message_id }, { react: ListReact })
        .then(() => {
        logging_1.default.info(NAMESPACE, 'React message success');
        return res.status(201).json({
            message: "Done"
        });
    });
});
//4. Delete message
const DeleteMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const message_id = req.params.message_id;
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    let mess = yield Message_model_1.default.findOne({ _id: message_id })
        .select('_id visible_to')
        .exec()
        .then((msg) => {
        return msg;
    });
    let ListVisible = [];
    ListVisible = mess.visible_to;
    if (mess.visible_to.findIndex((val) => val == payload.id) == -1) {
        ListVisible.push(payload.id);
        Message_model_1.default.findByIdAndUpdate({ _id: message_id }, { visible_to: ListVisible })
            .then(() => {
            logging_1.default.info(NAMESPACE, 'Delete message success');
            return res.status(201).json({
                message: "Done"
            });
        });
    }
});
//5. Remove message
const RemoveMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const message_id = req.params.message_id;
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    let mess = yield Message_model_1.default.findOne({ _id: message_id })
        .select('_id user')
        .exec()
        .then((msg) => {
        return msg;
    });
    if (payload.id == mess.user['_id']) {
        Message_model_1.default.findByIdAndUpdate({ _id: message_id }, { status: 1, status_name: 'Remove' })
            .then(() => {
            logging_1.default.info(NAMESPACE, 'Remove message success');
            return res.status(201).json({
                message: "Done"
            });
        });
    }
});
exports.default = {
    SendMessage, GetChat, ReactIcon, DeleteMessage, RemoveMessage
};
//# sourceMappingURL=Message.controller.js.map