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
const Attachment_model_1 = require("../models/Attachment.model");
const cloudinary = require("cloudinary");
//1.Lấy tất cả tin nhắn trong 1 channel
//Nếu có trong invisible ko hiện
const getMessageInChannel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) * 1 || 1;
        const limit = Number(req.query.limit) * 1 || 10;
        const skip = (page - 1) * limit;
        const channel_id = req.params.id;
        const channel = yield Channel_model_1.default.findById(channel_id);
        if (!channel) {
            return res.status(400).json({ message: "Channel not found" });
        }
        const is_MyChannel = channel.user.find(user => String(user) == String(req.user['_id']));
        if (!is_MyChannel) {
            res.status(400).json({ message: "This not your channel" });
        }
        const message = yield Message_model_1.default.find({ channel: String(channel_id) }).skip(skip).limit(limit);
        const List_Message = [];
        for (let mess in message) {
            let is_delete = message[mess].invisible_to.find(user => String(user) == String(req.user['_id']));
            if (!is_delete) {
                List_Message.push(message[mess]);
            }
        }
        res.json({ data: List_Message });
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
        //-----------Setup_file------------------------------
        //Cần định dạng lại file
        const fileAttachment = req.file;
        let file_name, format_type, size = "";
        if (fileAttachment) {
            file_name = fileAttachment.filename;
            format_type = fileAttachment.mimetype;
            size = String(fileAttachment.size);
        }
        const newAttachment = new Attachment_model_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            name: file_name,
            size: size,
            format_type: format_type,
        });
        //----------------------------------------------------
        const newMessage = new Message_model_1.default({
            _id: new mongoose_1.default.Types.ObjectId,
            user: req.user['_id'],
            status: 0,
            status_name: "Active",
            reply: reply,
            channel: channel_id,
            content: content,
            attachment: newAttachment._id
        });
        newMessage.save();
        yield newAttachment.save();
        //---------------------------------------------------
        cloudinary.v2.uploader.upload(fileAttachment.path, { resource_type: "raw" }).then((result) => __awaiter(void 0, void 0, void 0, function* () {
            yield Attachment_model_1.default.findByIdAndUpdate({ _id: newAttachment._id }, {
                link: result.url,
                user: req.user['_id'],
                res_model: "Message",
                res_id: newMessage._id
            });
        }));
        //---------------------------------------------------
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
        return res.json({ message: "Remove success" });
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
        let is_delete = message.invisible_to.find(user => String(user) == String(req.user['_id']));
        if (is_delete) {
            return res.json({ message: "Was delete" });
        }
        yield Message_model_1.default.findByIdAndUpdate({ _id: message_id }, {
            $push: { invisible_to: req.user['_id'] }
        });
        return res.json({ message: "Delete success" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
//5.React tin nhắn
const reactMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const message_id = req.params.id;
    const { emoji } = req.body;
    const message = yield Message_model_1.default.findById(message_id);
    if (!message) {
        res.status(400).json({ message: "Message not exist" });
    }
    if (String(message.user) != String(req.user['_id'])) {
        res.status(400).json({ message: "Message is not your" });
    }
    const react = {
        user: req.user['_id'],
        emoji: emoji
    };
    yield Message_model_1.default.findByIdAndUpdate({ _id: message_id }, {
        $push: { react: react }
    });
    return res.json({ message: "React succsess" });
});
exports.default = {
    getMessageInChannel, deleteMessage, removeMessage, chatMessageInChannel, reactMessage
};
//# sourceMappingURL=Message.controller.js.map