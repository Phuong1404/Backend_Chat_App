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
const Channel_model_1 = require("../models/Channel.model");
const User_model_1 = require("../models/User.model");
//1. Create Channel
const createChannel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { list_user, name } = req.body;
    if (list_user.length < 2) {
        return res.status(400).json({ message: "You cannot create a channel with less than 3 members" });
    }
    let user_channel = [];
    user_channel.push(String(req.user['_id']));
    for (let user in list_user) {
        user_channel.push(list_user[user]);
    }
    const newChannel = new Channel_model_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        name: name,
        user: user_channel,
        num_member: user_channel.length
    });
    yield newChannel.save();
    for (let user in user_channel) {
        yield User_model_1.default.findByIdAndUpdate({ _id: user_channel[user] }, {
            $push: { channel: newChannel._id }
        });
    }
    res.json({ data: newChannel });
});
//2. Add User(s) to Channel
const addUserToChannel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const channel_id = req.params.id;
    const channel = yield Channel_model_1.default.findById(channel_id);
    if (!channel) {
        return res.status(400).json({ message: "Channel not found" });
    }
    const is_MyChannel = channel.user.find(user => String(user) == String(req.user['_id']));
    console.log(is_MyChannel);
    if (!is_MyChannel) {
        res.status(400).json({ message: "This not your channel" });
    }
    const { list_user } = req.body;
    let user_channel = [];
    for (let user in list_user) {
        let is_In_Channel = channel.user.find(user1 => String(user1) == String(list_user[user]));
        if (!is_In_Channel) {
            user_channel.push(list_user[user]);
        }
    }
    yield Channel_model_1.default.findByIdAndUpdate({ _id: channel_id }, {
        $push: { user: user_channel },
        num_member: channel.num_member + user_channel.length
    });
    for (let user in user_channel) {
        yield User_model_1.default.findByIdAndUpdate({ _id: user_channel[user] }, {
            $push: { channel: channel_id }
        });
    }
    res.json({ message: "Add success" });
});
//3. Delete User(s) to Channel
const removeUserToChannel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const channel_id = req.params.id;
    const channel = yield Channel_model_1.default.findById(channel_id);
    if (!channel) {
        return res.status(400).json({ message: "Channel not found" });
    }
    const is_MyChannel = channel.user.find(user => String(user) == String(req.user['_id']));
    console.log(is_MyChannel);
    if (!is_MyChannel) {
        res.status(400).json({ message: "This not your channel" });
    }
    const { list_user } = req.body;
    let user_channel = [];
    for (let user in list_user) {
        let is_In_Channel = channel.user.find(user1 => String(user1) == String(list_user[user]));
        if (is_In_Channel) {
            user_channel.push(list_user[user]);
        }
    }
    console.log(user_channel);
    for (let user in user_channel) {
        yield Channel_model_1.default.findByIdAndUpdate({ _id: channel_id }, {
            $pull: { user: user_channel[user] },
            num_member: channel.num_member - user_channel.length
        });
        yield User_model_1.default.findByIdAndUpdate({ _id: user_channel[user] }, {
            $pull: { channel: channel_id }
        });
    }
    res.json({ message: "Delete success" });
});
//4. Update Channel
const updateChannel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const channel_id = req.params.id;
    const { name, avatar } = req.body;
    const channel = yield Channel_model_1.default.findById(channel_id);
    if (!channel) {
        return res.status(400).json({ message: "Channel not found" });
    }
    const is_MyChannel = channel.user.find(user => String(user) == String(req.user['_id']));
    console.log(is_MyChannel);
    if (!is_MyChannel) {
        res.status(400).json({ message: "This not your channel" });
    }
    yield Channel_model_1.default.findByIdAndUpdate({ _id: channel_id }, {
        name: name,
        avatar: avatar
    });
    res.json({ message: "Update success" });
});
//5. Get DataChannel
const getChannel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const channel_id = req.params.id;
    const channel = yield Channel_model_1.default.findById(channel_id)
        .populate("user", "_id name avatar");
    if (!channel) {
        return res.status(400).json({ message: "Channel not found" });
    }
    res.json({ data: channel });
});
//6. Leave Channel
const leaveChannel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const channel_id = req.params.id;
    const channel = yield Channel_model_1.default.findById(channel_id);
    if (!channel) {
        return res.status(400).json({ message: "Channel not found" });
    }
    const is_MyChannel = channel.user.find(user => String(user) == String(req.user['_id']));
    console.log(is_MyChannel);
    if (!is_MyChannel) {
        res.status(400).json({ message: "This not your channel" });
    }
    if (channel.num_member <= 2) {
        res.status(400).json({ message: "You cannot leave channel" });
    }
    yield Channel_model_1.default.findByIdAndUpdate({ _id: channel_id }, {
        $pull: { user: req.user['_id'] },
        num_member: channel.num_member - 1
    });
    res.json({ message: "Leave channel success" });
});
exports.default = {
    leaveChannel, createChannel, updateChannel, addUserToChannel, removeUserToChannel, getChannel
};
//# sourceMappingURL=Channel.controller.js.map