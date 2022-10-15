import { NextFunction, Request, Response } from "express";
import User from '../models/User.model'

//1. Lấy thông tin người dùng
const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("friend", "_id name avatar")
            .populate("channel", "_id name avatar num_member")
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
            .select('_id name avatar')
        res.json({ data: user })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
//3. Cập nhật người dùng
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { name, birthday, gender, avatar, address, job } = req.body;
        await User.findOneAndUpdate(
            { _id: req.user['_id'] },
            {
                name,
                avatar,
                birthday,
                gender,
                address,
                job
            }
        );

        res.json({ message: "Update success!" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export default {
    getUser, searchUser, updateUser
}
