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
const mongoose_1 = require("mongoose");
const FriendRequest_model_1 = require("../models/FriendRequest.model");
const Channel_model_1 = require("../models/Channel.model");
const User_model_1 = require("../models/User.model");
//1. Gửi yêu cầu kết bạn
const sendRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { recever_id } = req.body;
        console.log(recever_id);
        const request1 = yield FriendRequest_model_1.default.findOne({ $and: [{ 'recever': recever_id }, { 'sender': req.user['_id'] }] });
        console.log(request1);
        if (request1) {
            return res.status(400).json({ message: "Đã gửi lời mời" });
        }
        const newRequest = new FriendRequest_model_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            sender: req.user['_id'],
            recever: recever_id,
            status: 0,
            status_name: "Send"
        });
        yield newRequest.save();
        yield User_model_1.default.findOneAndUpdate({ _id: req.user['_id'] }, {
            $push: { friend_request: newRequest._id }
        });
        yield User_model_1.default.findOneAndUpdate({ _id: recever_id }, {
            $push: { friend_request: newRequest._id }
        });
        res.json({ message: "Send success!" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
//2. Hủy yêu cầu kết bạn
const RejectRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield FriendRequest_model_1.default.findById(req.params.id);
    if (!request) {
        return res.status(400).json({ message: "Request does not exist." });
    }
    if (String(request.recever) != String(req.user['_id'])) {
        return res.status(400).json({ message: "Request is not yours" });
    }
    yield FriendRequest_model_1.default.findByIdAndDelete({ _id: req.params.id });
    yield User_model_1.default.findOneAndUpdate({ _id: request.sender }, {
        $pull: { friend_request: request.sender }
    });
    yield User_model_1.default.findOneAndUpdate({ _id: request.recever }, {
        $pull: { friend_request: request.recever }
    });
    res.json({ message: "Delete Success" });
});
//3. Xóa Bỏ lời mời kết bạn
const CancelRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield FriendRequest_model_1.default.findById(req.params.id);
    if (!request) {
        return res.status(400).json({ message: "Request does not exist." });
    }
    if (String(request.sender) != String(req.user['_id'])) {
        return res.status(400).json({ message: "Request is not yours" });
    }
    yield FriendRequest_model_1.default.findByIdAndDelete({ _id: req.params.id });
    yield User_model_1.default.findOneAndUpdate({ _id: request.sender }, {
        $pull: { friend_request: request.sender }
    });
    yield User_model_1.default.findOneAndUpdate({ _id: request.recever }, {
        $pull: { friend_request: request.recever }
    });
    res.json({ message: "Delete Success" });
});
//4. Chấp nhận yêu cầu kết bạn
const AcceptRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield FriendRequest_model_1.default.findById(req.params.id);
    if (!request) {
        return res.status(400).json({ message: "Request does not exist." });
    }
    if (String(request.recever) != String(req.user['_id'])) {
        return res.status(400).json({ message: "Request is not yours" });
    }
    if (request.status == 1) {
        return res.status(400).json({ message: "Request was accept" });
    }
    let list_user = [];
    list_user.push(request.recever);
    list_user.push(request.sender);
    const newChannel = new Channel_model_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        num_member: 2,
        user: list_user
    });
    newChannel.save();
    yield FriendRequest_model_1.default.findByIdAndUpdate({ _id: req.params.id }, {
        status: 1,
        status_name: 'Accept'
    });
    yield User_model_1.default.findOneAndUpdate({ _id: request.sender }, {
        $push: { friend: request.sender, channel: newChannel._id }
    });
    yield User_model_1.default.findOneAndUpdate({ _id: request.recever }, {
        $push: { friend: request.recever, channel: newChannel._id }
    });
    res.json({ message: "Accept Success" });
});
exports.default = {
    sendRequest, RejectRequest, CancelRequest, AcceptRequest
};
//# sourceMappingURL=FriendRequest.controller.js.map