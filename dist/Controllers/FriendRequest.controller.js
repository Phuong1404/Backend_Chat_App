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
const mongoose_1 = require("mongoose");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const FriendRequest_model_1 = require("../Models/FriendRequest.model");
const User_model_1 = require("../Models/User.model");
const NAMESPACE = 'Friend Request';
//thêm 1 trường người gửi yêu cầu
const sendRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { receiver_id } = req.body;
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    let receiver = yield User_model_1.default.findOne({ _id: receiver_id }).
        select('_id avatar')
        .exec()
        .then((users) => {
        return users;
    });
    let sender = yield User_model_1.default.findOne({ email: payload.email }).
        select('_id avatar')
        .exec()
        .then((users) => {
        return users;
    });
    let Is_Friend = User_model_1.default.findOne({ $and: [{ _id: receiver_id }, { 'contact': { $elemMatch: { _id: sender._id } } }] })
        .then((users) => {
        if (users) {
            return false;
        }
        return true;
    });
    const _request = new FriendRequest_model_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        from: {
            user_id: sender._id,
            avatar: sender.avatar
        },
        to: {
            user_id: receiver._id,
            avatar: receiver.avatar
        },
        time: moment(),
        status: 0,
        status_name: "Chờ xác nhận",
        time_create: moment()
    });
    //nếu có trong danh sách bạn bè
    // return res.status(401).json({
    //     message:'Is friend'
    // });
    return _request
        .save()
        .then((request) => {
        return res.status(201).json({
            request
        });
    })
        .catch((error) => {
        return res.status(500).json({
            message: error.message,
            error
        });
    });
});
const acceptRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //cần người nhận yêu cầu
    //người gửi yêu cầu
});
//# sourceMappingURL=FriendRequest.controller.js.map