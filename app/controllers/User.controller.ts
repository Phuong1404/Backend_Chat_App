import { NextFunction, Request, Response } from "express";
import User from '../models/User.model'
import Attachment from '../models/Attachment.model'
import mongoose, { model } from 'mongoose';
import * as cloudinary from 'cloudinary'

//1. Lấy thông tin người dùng
const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("friend", "_id name avatar")
            .populate("channel", "_id name avatar num_member")
            .populate("avatar", "-_id link")
            .populate("friend_request");
        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }
        res.json({ data: user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
//2. Tìm kiếm người dùng
const searchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { data } = req.body
        const user = await User.find({ $or: [{ name: { $regex: data } }, { 'phone': data }, { 'email': data }] })
            .limit(10)
            .select('_id name')
            .populate("avatar", "-_id link")
        res.json({ data: user })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
//3. Cập nhật người dùng
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { name, birthday, gender, address, job } = req.body;
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
        //Tạo hình ảnh mới
        const newAttachment = new Attachment({
            _id: new mongoose.Types.ObjectId(),
            name: avatar_name,
            size: size,
            format_type: format_type,
            type: type,
            type_name: type_name
        })
        await User.findOneAndUpdate(
            { _id: req.user['_id'] },
            {
                name,
                birthday,
                gender,
                avatar: newAttachment._id,
                address,
                job
            }
        );
        await newAttachment.save();
        //---------------------------------------------------
        cloudinary.v2.uploader.upload(avatar.path).then(async (result) => {
            await Attachment.findByIdAndUpdate(
                { _id: newAttachment._id },
                {
                    link: result.url,
                    user: req.user['_id'],
                    res_model: "User",
                    res_id: req.user['_id']
                }
            )
        })
        //---------------------------------------------------
        res.json({ message: "Update success!" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export default {
    getUser, searchUser, updateUser
}
