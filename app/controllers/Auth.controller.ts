import { NextFunction, Request, Response } from "express";
import User from '../models/User.model'
import logging from "../config/logging";
import config from "../config/config";
import * as bcrypt from 'bcrypt';
import * as moment from "moment";
import * as jwt from 'jsonwebtoken';

const NAMESPACE = 'Auth'

const Register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { name, email, phone, birthday, gender, avatar, password } = req.body;

        const user_email = await User.findOne({ email });
        if (user_email) {
            return res.status(400).json({ message: "Email này đã tồn tại." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Mật khẩu phải ít nhất 6 kí tự." });
        }
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
    catch (error) {
        logging.error(NAMESPACE, error.message, error)
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
        logging.error(NAMESPACE, error.message, error)
        return res.status(500).json({ message: error.message });
    }
}
const createAccessToken = (payload) => {
    return jwt.sign(payload, config.server.token.secret, {
        expiresIn: "1d",
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
        console.log(rf_token)
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
export default {
    Register, Login, GenerateAccessToken, Logout,ChangePass
}
