import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose';
import User from '../models/User.model'
import Post from "../models/Post.model";
import Comment from "../models/Comment.model";
import Attachment from '../models/Attachment.model'
import moment from "moment";
import  cloudinary from 'cloudinary'
const NAMESPACE = "POST"

//1. Tạo bài post
const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // upload.array("PhotosList", 6);
        const { content } = req.body
        const files = req.files
        if (content.length === 0 && !files) {
            return res.status(400).json({ msg: "Please add content or image." });
        }
        if (files) {
            let listAttachment = []
            let attachmentId = []
            for (let file in files) {
                const newAttachment = new Attachment({
                    _id: new mongoose.Types.ObjectId(),
                    name: files[file].filename,
                    size: String(files[file].size),
                    format_type: files[file].mimetype,
                    type: 0,
                    type_name: "Image"
                })
                listAttachment.push(newAttachment)
                attachmentId.push(newAttachment.id)
            }
            const newPost = new Post({
                _id: new mongoose.Types.ObjectId(),
                content: content,
                attachment: attachmentId,
                user:req.user['_id'],
                time: moment,
            })

            await newPost.save().then(async (result) => {
                if (result) {
                    for (let item in listAttachment) {
                        await listAttachment[item].save()

                        //------------------------------------------------
                        cloudinary.v2.uploader.upload(files[item].path).then(async (result) => {
                            await Attachment.findByIdAndUpdate(
                                { _id: listAttachment[item]._id },
                                {
                                    link: result.url,
                                    user: req.user['_id'],
                                    res_model: "Post",
                                    res_id: newPost._id
                                }
                            )
                        })
                        //------------------------------------------------
                    }
                }
            }).catch((error) => {
                return res.status(500).json({ message: error.message });
            })
            res.json({message:'Success'})
        }
        else {
            const newPost = await new Post({
                _id: new mongoose.Types.ObjectId(),
                content: content,
                user:req.user['_id'],
                time: moment,
            })
            await newPost.save()
            res.json({message:'Success'})
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//2. Lấy danh sách bài post
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.find({
            user: [...req.user['friend'], req.user['_id']]
        }).sort("-createdAt")
            .populate("user", "name avatar")

        res.json({
            result: post.length,
            post,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//3. Cập nhật bài post
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//4. React post
//5. Unreact post
//6. Lấy 1 bài post
const getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user", "name avatar")
        if (!post)
            return res.status(400).json({ msg: "This post does not exits." });

        res.json({
            data: post,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//7. 
//8. Xóa bài post
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findOneAndDelete({
            _id: req.params.id,
        });
        await Comment.deleteMany({ _id: { $in: post.comments } });

        res.json({
            message: "Deleted Post!"
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//9. Lưu bài post
const savePost = async (req: Request, res: Response, next: NextFunction) => {
    try {

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//10. Bỏ lưu
const unSavePost = async (req: Request, res: Response, next: NextFunction) => {
    try {

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//11. Lấy danh sách lưu
const getSavePost = async (req: Request, res: Response, next: NextFunction) => {
    try {

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
export default {
    createPost, getPosts, updatePost, getPost,
    deletePost, savePost, unSavePost, getSavePost
}
