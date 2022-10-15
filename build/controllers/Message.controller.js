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
const Message_model_1 = require("../models/Message.model");
const Channel_model_1 = require("../models/Channel.model");
//1.Lấy tất cả tin nhắn trong 1 channel
//Nếu có trong invisible ko hiện
const getMessageInChannel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const channel_id = req.params.id;
        const channel = yield Channel_model_1.default.findById(channel_id);
        if (!channel) {
            return res.status(400).json({ message: "Channel not found" });
        }
        const is_MyChannel = channel.user.find(user => String(user) == String(req.user['_id']));
        if (!is_MyChannel) {
            res.status(400).json({ message: "This not your channel" });
        }
        const message = yield Message_model_1.default.find({ channel: channel_id });
        res.json({ data: message });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
//2.Nhắn tin vào 1 channel
const chatMessageInChannel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const channel_id = req.params.id;
        const { content, reply } = req.body;
        const channel = yield Channel_model_1.default.findById(channel_id);
        if (!channel) {
            return res.status(400).json({ message: "Channel not found" });
        }
        const is_MyChannel = channel.user.find(user => String(user) == String(req.user['_id']));
        if (!is_MyChannel) {
            res.status(400).json({ message: "This not your channel" });
        }
        const newMessage = new Message_model_1.default({
            _id: mongoose_1.default.Types.ObjectId,
            user: req.user['_id'],
            status: 0,
            status_name: "Active",
            reply: reply,
            channel: channel_id
        });
        newMessage.save();
        res.json({ data: newMessage });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
//3.Gỡ tin nhắn
const removeMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message_id = req.params.id;
        const message = yield Message_model_1.default.findById(message_id);
        if (!message) {
            res.status(400).json({ message: "Message not exist" });
        }
        if (String(message.user) != String(req.user['_id'])) {
            res.status(400).json({ message: "Message is not your" });
        }
        yield Message_model_1.default.findByIdAndUpdate({ _id: message_id }, {
            status: 1,
            status_name: "Remove"
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
//4.Xóa tin nhắn
const deleteMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message_id = req.params.id;
        const message = yield Message_model_1.default.findById(message_id);
        if (!message) {
            res.status(400).json({ message: "Message not exist" });
        }
        if (String(message.user) != String(req.user['_id'])) {
            res.status(400).json({ message: "Message is not your" });
        }
        yield Message_model_1.default.findByIdAndUpdate({ _id: message_id }, {
            $push: { invisible_to: req.user['_id'] }
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
//5.React tin nhắn
exports.default = {
    getMessageInChannel, deleteMessage, removeMessage, chatMessageInChannel
};
//# sourceMappingURL=Message.controller.js.map