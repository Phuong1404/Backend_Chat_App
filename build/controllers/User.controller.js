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
const User_model_1 = require("../models/User.model");
const Attachment_model_1 = require("../models/Attachment.model");
const mongoose_1 = require("mongoose");
const cloudinary = require("cloudinary");
//0. Lấy thông tin bản thân
const getMyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user['_id']);
    try {
        const user = yield User_model_1.default.findById(req.user['_id'])
            .select("-password")
            .populate("friend", "_id name avatar")
            .populate("channel", "_id name avatar num_member")
            .populate("avatar", "-_id link")
            .populate("friend_request");
        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }
        res.json({ data: user });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
//1. Lấy thông tin người dùng
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_model_1.default.findById(req.params.id)
            .select("-password -channel -friend_request -status -status_name")
            .populate("friend", "_id name avatar")
            // .populate("channel", "_id name avatar num_member")
            .populate("avatar", "-_id link");
        // .populate("friend_request");
        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }
        res.json({ data: user });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
//2. Tìm kiếm người dùng
const searchUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { data } = req.query;
        const user = yield User_model_1.default.find({ $or: [{ name: { $regex: data } }, { 'phone': data }, { 'email': data }] })
            .limit(10)
            .select('_id name')
            .populate("avatar", "-_id link");
        res.json({ data: user });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
//3. Cập nhật người dùng
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, birthday, gender, address, job } = req.body;
        //Gán hình ảnh
        const avatar = req.file;
        let avatar_name, format_type, type_name, size = "";
        let type = 0;
        if (avatar) {
            avatar_name = avatar.filename;
            format_type = avatar.mimetype;
            type_name = "Image";
            size = String(avatar.size);
            //Tạo hình ảnh mới
            const newAttachment = new Attachment_model_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                name: avatar_name,
                size: size,
                format_type: format_type,
                type: type,
                type_name: type_name
            });
            yield User_model_1.default.findOneAndUpdate({ _id: req.user['_id'] }, {
                name,
                birthday,
                gender,
                avatar: newAttachment._id,
                address,
                job
            });
            yield newAttachment.save();
            //---------------------------------------------------
            cloudinary.v2.uploader.upload(avatar.path).then((result) => __awaiter(void 0, void 0, void 0, function* () {
                yield Attachment_model_1.default.findByIdAndUpdate({ _id: newAttachment._id }, {
                    link: result.url,
                    user: req.user['_id'],
                    res_model: "User",
                    res_id: req.user['_id']
                });
            }));
            //---------------------------------------------------
            res.json({ message: "Update success!" });
        }
        else {
            yield User_model_1.default.findOneAndUpdate({ _id: req.user['_id'] }, {
                name,
                birthday,
                gender,
                address,
                job
            });
            res.json({ message: "Update success!" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.default = {
    getUser, searchUser, updateUser, getMyUser
};
//# sourceMappingURL=User.controller.js.map