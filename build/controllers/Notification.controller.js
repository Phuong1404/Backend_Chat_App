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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Notification_model_1 = __importDefault(require("../models/Notification.model"));
const createNotify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { receiver, url, text, content, image } = req.body;
        const notify = yield new Notification_model_1.default({
            receiver: receiver,
            url: url,
            text: text,
            content: content,
            image: image,
            user: req.user['_id'],
        });
        yield notify.save();
        return res.json({ notify });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});
const deleteNotify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notify = yield Notification_model_1.default.findOneAndDelete({
            id: req.params.id,
            url: req.query.url,
        });
        return res.json({ notify });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});
const getNotify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifies = yield Notification_model_1.default.find({ receiver: req.user['_id'] })
            .sort("-createdAt")
            .populate("user", "-password");
        return res.json({ notifies });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});
const isReadNotify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifies = yield Notification_model_1.default.findOneAndUpdate({ _id: req.params.id }, {
            isRead: true,
        });
        return res.json({ notifies });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});
exports.default = {
    isReadNotify, getNotify, deleteNotify, createNotify
};
//# sourceMappingURL=Notification.controller.js.map