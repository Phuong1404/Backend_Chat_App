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
//1. Lấy thông tin người dùng
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_model_1.default.findById(req.params.id)
            .select("-password")
            .populate("friend", "_id name avatar")
            .populate("channel", "_id name avatar num_member")
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
//2. Tìm kiếm người dùng
const searchUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { data } = req.body;
        const user = yield User_model_1.default.find({ $or: [{ name: { $regex: data } }, { 'phone': data }, { 'email': data }] })
            .limit(10)
            .select('_id name avatar');
        res.json({ data: user });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
//3. Cập nhật người dùng
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, birthday, gender, avatar, address, job } = req.body;
        yield User_model_1.default.findOneAndUpdate({ _id: req.user['_id'] }, {
            name,
            avatar,
            birthday,
            gender,
            address,
            job
        });
        res.json({ message: "Update success!" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.default = {
    getUser, searchUser, updateUser
};
//# sourceMappingURL=User.controller.js.map