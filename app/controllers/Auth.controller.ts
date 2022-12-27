import { NextFunction, Request, Response } from "express";
import User from '../models/User.model'
import Attachment from '../models/Attachment.model'
import config from "../config/config";
import mongoose, { model } from 'mongoose';
import bcrypt from 'bcrypt';
import moment from "moment";
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary'

const NAMESPACE = 'Auth'

const Register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { name, email, phone, birthday, gender, password } = req.body;
        //Gán hình ảnh
        const avatar = req.file
        let avatar_name, format_type, type_name, size = ""
        let type = 0
        if (avatar) {
            avatar_name = avatar.filename
            format_type = avatar.mimetype
            type_name = "Image"
            size = String(avatar.size)
        }
        //Kiểm tra điều kiện tồn tại
        const user_email = await User.findOne({ email });
        const user_phone = await User.findOne({ phone });
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
            const newAttachment = new Attachment({
                _id: new mongoose.Types.ObjectId(),
                name: avatar_name,
                size: size,
                format_type: format_type,
                type: type,
                type_name: type_name
            })
            //Tạo người dùng mới
            const passwordHash = await bcrypt.hash(password, 12);
            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                name: name,
                email: email,
                phone: phone,
                birthday: birthday,
                password: passwordHash,
                gender: gender,
                avatar: newAttachment._id,
                status: 0,// 0. còn dùng,1. bị khóa
                status_name: "Active",
                time_create: moment()
            })
            //Tạo token mới
            const access_token = createAccessToken({ id: newUser._id });
            const refresh_token = createRefreshToken({ id: newUser._id });
            res.cookie("refreshtoken", refresh_token, {
                httpOnly: true,
                path: "/auth/refresh_token",
                maxAge: 30 * 7 * 24 * 60 * 60 * 1000,
            });

            await newUser.save();
            await newAttachment.save().then(async () => {
                //---------------------------------------------------
                await cloudinary.v2.uploader.upload(avatar.path).then(async (result) => {
                    await Attachment.findByIdAndUpdate(
                        { _id: newAttachment._id },
                        {
                            link: result.url,
                            user: newUser._id,
                            res_model: "User",
                            res_id: newUser._id
                        }
                    )
                })
                //---------------------------------------------------
            }).catch((err => {
                res.status(500).json({ "message": err })
            }))

            res.json({
                message: "Đăng kí thành công!",
                access_token,
                user: {
                    ...newUser._doc,
                    password: "",
                },
            });
        }
        else {

            const passwordHash = await bcrypt.hash(password, 12);

            const newUser = new User({
                name: name,
                email: email,
                phone: phone,
                birthday: birthday,
                password: passwordHash,
                gender: gender,
                avatar: avatar,
                status: 0,// 0. còn dùng,1. bị khóa
                status_name: "Active",
                time_create: moment()
            })
            const access_token = createAccessToken({ id: newUser._id });
            const refresh_token = createRefreshToken({ id: newUser._id });
            res.cookie("refreshtoken", refresh_token, {
                httpOnly: true,
                path: "/auth/refresh_token",
                maxAge: 30 * 7 * 24 * 60 * 60 * 1000,
            });
            await newUser.save();
            res.json({
                message: "Đăng kí thành công!",
                access_token,
                user: {
                    ...newUser._doc,
                    password: "",
                },
            });
        }

    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const Login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        const user = await User.find({ $or: [{ email: username }, { phone: username }] })
        if (user.length < 1) {
            return res.status(400).json({ message: "Tài khoản này không tồn tại." });
        }
        const isMatch = await bcrypt.compare(password, user[0].password);
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
            user: {
                ...user[0]._doc,
                password: "",
            },
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const createAccessToken = (payload) => {
    return jwt.sign(payload, config.server.token.secret, {
        expiresIn: "7d",
    });
};
const createRefreshToken = (payload) => {
    return jwt.sign(payload, config.server.token.secret, {
        expiresIn: "30d",
    });
};
const GenerateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rf_token = req.cookies.refreshtoken;
        if (!rf_token) return res.status(400).json({ message: "Đăng nhập ngay." });
        jwt.verify(
            rf_token,
            config.server.token.secret,
            async (error, result) => {
                if (error) {
                    return res.status(400).json({ message: "Đăng nhập ngay." });
                }
                const user = await User.findById(result.id)
                    .select("-password")

                if (!user) {
                    return res.status(400).json({ msg: "Email này không tồn tại." });
                }
                const access_token = createAccessToken({ id: result.id });

                res.json({
                    access_token,
                    user,
                });

            }
        );
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const Logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("refreshtoken", { path: "/auth/refresh_token" });
        return res.json({ message: "Đăng xuất thành công!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const ChangePass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, newpassword } = req.body
        const user = await User.findOne({ _id: req.user['_id'] })
        if (!user) {
            return res.status(400).json({ message: "Tài khoản này không tồn tại." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng." });
        }
        await User.findOneAndUpdate(
            { _id: req.user['_id'] },
            {
                password: await bcrypt.hash(newpassword, 12)
            }
        );
        res.json({ message: "Update success!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const ResetPassword = async (req: Request, res: Response, next: NextFunction) => {

    const { email, phone } = req.body
    const User1 = await User.findOne({ email: email, phone: phone })
    if (!User1) {
        res.status(404).json({ 'message': 'Người dùng không tồn tại' })
    }
    else {
        let new_pass = generatePassword()
        await User.findByIdAndUpdate({_id:User1._id},{
            password: await bcrypt.hash(new_pass, 12)
        })
        const info = await config.mail.sendMail({
            from: 't.xuanphuong1404@outlook.com',
            to: email,
            subject: "Social Network - Đặt lại mật khẩu",
            html: `<strong>Mật khẩu mới của bạn là ${new_pass}</strong>`,
            headers: { 'x-myheader': 'test header' }
        });
        console.log("Message sent: %s", info.response);
        res.json({ 'message': 'success' })
    }
}
const generatePassword = () => {
    var length = 12,
        charset =
            "@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*0123456789abcdefghijklmnopqrstuvwxyz",
        password = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
}
export default {
    Register, Login, GenerateAccessToken, Logout, ChangePass, ResetPassword
}
