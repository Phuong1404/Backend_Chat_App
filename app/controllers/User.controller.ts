import { NextFunction, Request, Response } from "express";
import User from '../models/User.model'
import Attachment from '../models/Attachment.model'
import Channel from "../models/Channel.model";
import Post from "../models/Post.model"
import mongoose, { model } from 'mongoose';
import cloudinary from 'cloudinary'
//0. Lấy thông tin bản thân
const getMyUser = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user['_id'])
    try {
        const user = await User.findById(req.user['_id'])
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
}
//1. Lấy thông tin người dùng
const getUserPublic = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password -channel -friend_request -status -status_name")
            .populate("friend", "_id name avatar")
            // .populate("channel", "_id name avatar num_member")
            .populate("avatar", "-_id link")
        // .populate("friend_request");
        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }
        res.json({ data: user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password -channel -friend_request -status -status_name")
            .populate("friend", "_id name avatar")
            // .populate("channel", "_id name avatar num_member")
            .populate("avatar", "-_id link")
        // .populate("friend_request");
        let is_friend = false
        const channel = await Channel.findOne({ $and: [{ user: { $all: [req.user['_id']] } }, { user: { $all: [req.params.id] } }, { num_member: 2 }] })
        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }
        if (user.friend.findIndex(u => String(u['_id']) == String(req.user['_id'])) != -1) {
            is_friend = true
        }
        let chan = ""
        if (channel) {
            chan = channel._id
        }
        res.json({ data: user, channel: chan, is_friend: is_friend });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
//2. Tìm kiếm người dùng
const searchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { data } = req.query
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
        else {
            await User.findOneAndUpdate(
                { _id: req.user['_id'] },
                {
                    name,
                    birthday,
                    gender,
                    address,
                    job
                }
            );
            res.json({ message: "Update success!" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
//4. Danh sách bạn bè
const listFriend = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user['_id'])
        const post = await Post.find({
            user: [...req.user['friend'], req.user['_id']]
        }).count()
        const list_friend = user.friend
        let FriendList = []
        for (let friend in list_friend) {
            let friend1 = await User.findById(list_friend[friend])
            let avatar = ""
            if (friend1.avatar) {
                const attachment = await Attachment.findOne({ _id: friend1.avatar })
                if (attachment) {
                    avatar = attachment.link
                }
            }
            const val = {
                "_id": friend1._id,
                "name": friend1.name,
                "avatar": avatar,
                "gender": friend1.gender,
                "friend": friend1.friend.length,
                "post": post
            }
            FriendList.push(val)
        }
        res.json(FriendList)
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
//5. Đề xuất bạn bè
const suggestionUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newArr = [...req.user['friend'], req.user['_id']];
        const num = req.query.num || 10;
        const users = await User.aggregate([
            {
                $match: { _id: { $nin: newArr } },
            },
            {
                $sample: { size: Number(num) },
            },
            {
                $project: { 'password': 0, 'friend': 0, 'channel': 0, 'friend_request': 0, 'status': 0, 'status_name': 0, 'time_create': 0, 'createdAt': 0, 'updatedAt': 0 }
            }
        ])
        const populateQuery = [
            {
                path: 'avatar',
                select: '-_id link',
            },

        ];
        const user1 = await User.populate(users, populateQuery);
        return res.json({
            user1,
            result: user1.length,
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}
//6. Get All User Not Friend
const allUserNotFriend = async (req: Request, res: Response, next: NextFunction) => {
    const newArr = [...req.user['friend'], req.user['_id']];
    const user = await User.find({ id: { $nin: newArr } })
        .select('_id name')
        .populate("avatar", "-_id link")
    return res.json({
        user,
        result: user.length,
    });
}
const getListImageUser = async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.params.id
    const list_Image1 = await Attachment.find({ $and: [{ user: user_id }, { 'res_model': 'Post' }] })
        .sort("-createdAt")
    let list_Image = []
    if (String(user_id) == String(req.user['_id'])) {
        list_Image = list_Image1
    }
    else {
        for (let i in list_Image1) {

            let temp = await Post.findById(list_Image1[i].res_id)
            if (temp) {
                if (temp.ispublic) {
                    list_Image.push(list_Image1[i])
                }
            }

        }
    }
    return res.json({
        list_Image,
        result: list_Image.length,
    });
}
export default {
    getUser, searchUser, updateUser, getMyUser, listFriend, getUserPublic,
    suggestionUser, allUserNotFriend, getListImageUser
}
