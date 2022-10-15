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
const logging_1 = require("../config/logging");
const config_1 = require("../config/config");
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const NAMESPACE = 'Auth';
const Register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, email, phone, birthday, gender, avatar, password } = req.body;
        const user_email = yield User_model_1.default.findOne({ email });
        if (user_email) {
            return res.status(400).json({ message: "Email này đã tồn tại." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Mật khẩu phải ít nhất 6 kí tự." });
        }
        const passwordHash = yield bcrypt.hash(password, 12);
        const newUser = new User_model_1.default({
            name: name,
            email: email,
            phone: phone,
            birthday: birthday,
            password: passwordHash,
            gender: gender,
            avatar: avatar,
            status: 0,
            status_name: "Active",
            time_create: moment()
        });
        const access_token = createAccessToken({ id: newUser._id });
        const refresh_token = createRefreshToken({ id: newUser._id });
        res.cookie("refreshtoken", refresh_token, {
            httpOnly: true,
            path: "/auth/refresh_token",
            maxAge: 30 * 7 * 24 * 60 * 60 * 1000,
        });
        yield newUser.save();
        res.json({
            message: "Đăng kí thành công!",
            access_token,
            user: Object.assign(Object.assign({}, newUser._doc), { password: "" }),
        });
    }
    catch (error) {
        logging_1.default.error(NAMESPACE, error.message, error);
        return res.status(500).json({ message: error.message });
    }
});
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield User_model_1.default.find({ $or: [{ email: username }, { phone: username }] });
        if (user.length < 1) {
            return res.status(400).json({ message: "Tài khoản này không tồn tại." });
        }
        const isMatch = yield bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng." });
        }
        const access_token = createAccessToken({ id: user[0]._id });
        const refresh_token = createRefreshToken({ id: user[0]._id });
        res.cookie("refreshtoken", refresh_token, {
            httpOnly: true,
            path: "/auth/refresh_token",
            maxAge: 30 * 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            message: "Đăng nhập thành công!",
            access_token,
            user: Object.assign(Object.assign({}, user[0]._doc), { password: "" }),
        });
    }
    catch (error) {
        logging_1.default.error(NAMESPACE, error.message, error);
        return res.status(500).json({ message: error.message });
    }
});
const createAccessToken = (payload) => {
    return jwt.sign(payload, config_1.default.server.token.secret, {
        expiresIn: "1d",
    });
};
const createRefreshToken = (payload) => {
    return jwt.sign(payload, config_1.default.server.token.secret, {
        expiresIn: "30d",
    });
};
const GenerateAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rf_token = req.cookies.refreshtoken;
        console.log(rf_token);
        if (!rf_token)
            return res.status(400).json({ message: "Đăng nhập ngay." });
        jwt.verify(rf_token, config_1.default.server.token.secret, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                return res.status(400).json({ message: "Đăng nhập ngay." });
            }
            const user = yield User_model_1.default.findById(result.id)
                .select("-password");
            if (!user) {
                return res.status(400).json({ msg: "Email này không tồn tại." });
            }
            const access_token = createAccessToken({ id: result.id });
            res.json({
                access_token,
                user,
            });
        }));
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
const Logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("refreshtoken", { path: "/auth/refresh_token" });
        return res.json({ message: "Đăng xuất thành công!" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
const ChangePass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, newpassword } = req.body;
        const user = yield User_model_1.default.findOne({ _id: req.user['_id'] });
        if (!user) {
            return res.status(400).json({ message: "Tài khoản này không tồn tại." });
        }
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng." });
        }
        yield User_model_1.default.findOneAndUpdate({ _id: req.user['_id'] }, {
            password: yield bcrypt.hash(newpassword, 12)
        });
        res.json({ message: "Update success!" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.default = {
    Register, Login, GenerateAccessToken, Logout, ChangePass
};
//# sourceMappingURL=Auth.controller.js.map