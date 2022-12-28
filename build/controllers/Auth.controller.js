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
const User_model_1 = __importDefault(require("../models/User.model"));
const Attachment_model_1 = __importDefault(require("../models/Attachment.model"));
const config_1 = __importDefault(require("../config/config"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const NAMESPACE = 'Auth';
const Register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, email, phone, birthday, gender, password } = req.body;
        //Gán hình ảnh
        const avatar = req.file;
        let avatar_name, format_type, type_name, size = "";
        let type = 0;
        if (avatar) {
            avatar_name = avatar.filename;
            format_type = avatar.mimetype;
            type_name = "Image";
            size = String(avatar.size);
        }
        //Kiểm tra điều kiện tồn tại
        const user_email = yield User_model_1.default.findOne({ email });
        const user_phone = yield User_model_1.default.findOne({ phone });
        if (user_email) {
            return res.status(400).json({ message: "Email này đã tồn tại." });
        }
        if (user_phone) {
            return res.status(400).json({ message: "Số điện thoại này đã tồn tại." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Mật khẩu phải ít nhất 6 kí tự." });
        }
        //Tạo hình ảnh mới
        if (avatar) {
            //Tạo hình ảnh mới
            const newAttachment = new Attachment_model_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                name: avatar_name,
                size: size,
                format_type: format_type,
                type: type,
                type_name: type_name
            });
            //Tạo người dùng mới
            const passwordHash = yield bcrypt_1.default.hash(password, 12);
            const newUser = new User_model_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                name: name,
                email: email,
                phone: phone,
                birthday: birthday,
                password: passwordHash,
                gender: gender,
                avatar: newAttachment._id,
                status: 0,
                status_name: "Active",
                time_create: (0, moment_1.default)()
            });
            //Tạo token mới
            const access_token = createAccessToken({ id: newUser._id });
            const refresh_token = createRefreshToken({ id: newUser._id });
            res.cookie("refreshtoken", refresh_token, {
                httpOnly: true,
                path: "/auth/refresh_token",
                maxAge: 30 * 7 * 24 * 60 * 60 * 1000,
            });
            yield newUser.save();
            yield newAttachment.save().then(() => __awaiter(void 0, void 0, void 0, function* () {
                //---------------------------------------------------
                yield cloudinary_1.default.v2.uploader.upload(avatar.path).then((result) => __awaiter(void 0, void 0, void 0, function* () {
                    yield Attachment_model_1.default.findByIdAndUpdate({ _id: newAttachment._id }, {
                        link: result.url,
                        user: newUser._id,
                        res_model: "User",
                        res_id: newUser._id
                    });
                }));
                //---------------------------------------------------
            })).catch((err => {
                res.status(500).json({ "message": err });
            }));
            res.json({
                message: "Đăng kí thành công!",
                access_token,
                user: Object.assign(Object.assign({}, newUser._doc), { password: "" }),
            });
        }
        else {
            const passwordHash = yield bcrypt_1.default.hash(password, 12);
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
                time_create: (0, moment_1.default)()
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
    }
    catch (error) {
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
        const isMatch = yield bcrypt_1.default.compare(password, user[0].password);
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
        return res.status(500).json({ message: error.message });
    }
});
const createAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.default.server.token.secret, {
        expiresIn: "7d",
    });
};
const createRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.default.server.token.secret, {
        expiresIn: "30d",
    });
};
const GenerateAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rf_token = req.cookies.refreshtoken;
        if (!rf_token)
            return res.status(400).json({ message: "Đăng nhập ngay." });
        jsonwebtoken_1.default.verify(rf_token, config_1.default.server.token.secret, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
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
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng." });
        }
        yield User_model_1.default.findOneAndUpdate({ _id: req.user['_id'] }, {
            password: yield bcrypt_1.default.hash(newpassword, 12)
        });
        res.json({ message: "Update success!" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
const ResetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phone } = req.body;
    const User1 = yield User_model_1.default.findOne({ email: email, phone: phone });
    if (!User1) {
        res.status(404).json({ 'message': 'Người dùng không tồn tại' });
    }
    else {
        let new_pass = generatePassword();
        yield User_model_1.default.findByIdAndUpdate({ _id: User1._id }, {
            password: yield bcrypt_1.default.hash(new_pass, 12)
        });
        const info = yield config_1.default.mail.sendMail({
            from: 'social.network.ck@outlook.com',
            to: email,
            subject: "Social Network - Đặt lại mật khẩu",
            html: `<strong>Mật khẩu mới của bạn là ${new_pass}</strong>`,
            headers: { 'x-myheader': 'test header' }
        });
        console.log("Message sent: %s", info.response);
        res.json({ 'message': 'success' });
    }
});
const generatePassword = () => {
    var length = 12, charset = "@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*0123456789abcdefghijklmnopqrstuvwxyz", password = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
};
exports.default = {
    Register, Login, GenerateAccessToken, Logout, ChangePass, ResetPassword
};
//# sourceMappingURL=Auth.controller.js.map