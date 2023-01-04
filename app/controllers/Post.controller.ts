import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose';
import User from '../models/User.model'
import Post from "../models/Post.model";
import Comment from "../models/Comment.model";
import Attachment from '../models/Attachment.model'
import SavePost from "../models/SavePost.model";
import moment from "moment";
import cloudinary from 'cloudinary'
const NAMESPACE = "POST"

//1. Tạo bài post
const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // upload.array("PhotosList", 6);
        const { content, ispublic } = req.body
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
                await newAttachment.save()
                listAttachment.push(newAttachment)
                attachmentId.push(newAttachment.id)
            }
            const newPost = new Post({
                _id: new mongoose.Types.ObjectId(),
                content: content,
                attachment: attachmentId,
                user: req.user['_id'],
                ispublic: ispublic,
                isnotify: true,
                time: moment(),
                status: 1,
                status_type: "post"
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
            res.json({ message: 'Success' })
        }
        else {
            const newPost = await new Post({
                _id: new mongoose.Types.ObjectId(),
                content: content,
                user: req.user['_id'],
                time: moment(),
            })
            await newPost.save()
            res.json({ message: 'Success' })
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
            .populate("attachment", "_id link")
        const populateQuery = [
            {
                path: 'user.avatar',
                select: '_id link',
            },
        ];
        const post2 = await Post.populate(post, populateQuery);
        let post1 = []
        for (let i in post2) {
            if (post2[i].ispublic) {
                post1.push(post2[i])
            }
            else {
                if (String(post2[i].user['_id']) == String(req.user['_id'])) {
                    post1.push(post2[i])
                }
            }

        }
        res.json({
            result: post1.length,
            post1,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
const getPostsUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = req.params.id
        const post = await Post.find({
            user: user_id
        }).sort("-createdAt")
            .populate("user", "name avatar")
            .populate("attachment", "_id link")
        const populateQuery = [
            {
                path: 'user.avatar',
                select: '_id link',
            },
        ];
        const post2 = await Post.populate(post, populateQuery);
        let post1 = []
        console.log(String(user_id) == String(req.user['_id']))
        if (String(user_id) == String(req.user['_id'])) {
            post1 = post2
        }
        else {
            for (let i in post2) {
                if (post2[i].ispublic) {
                    post1.push(post2[i])
                }
            }
        }
        res.json({
            result: post1.length,
            post1,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//3. Cập nhật bài post
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { content, file_delete } = req.body
        const post = await Post.findById(req.params.id)
        //Bỏ những file bị bỏ đi
        let new_attachment = post.attachment.filter(item => !file_delete.includes(item));

        const files = req.files
        if (content.length === 0 && !files) {
            return res.status(400).json({ msg: "Please add content or image." });
        }
        let Content = post.content
        if (content.length !== 0) {
            Content = content
        }
        if (files) {
            let listAttachment = []
            for (let file in files) {
                const newAttachment = new Attachment({
                    _id: new mongoose.Types.ObjectId(),
                    name: files[file].filename,
                    size: String(files[file].size),
                    format_type: files[file].mimetype,
                    type: 0,
                    type_name: "Image"
                })
                await newAttachment.save()
                listAttachment.push(newAttachment)
                new_attachment.push(newAttachment._id)
            }
            await Post.findByIdAndUpdate({ _id: req.params.id }, {
                content: Content,
                attachment: new_attachment
            }).then(async (result) => {
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
                                    res_id: req.params.id
                                }
                            )
                        })
                        //------------------------------------------------
                    }
                }
            }).catch((error) => {
                return res.status(500).json({ message: error.message });
            })
            res.json({ message: 'Success' })
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//4. React post
const reactPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findById(req.params.id)
        const is_react = post.react.find(react => String(react) == String(req.user['_id']))
        if (!is_react) {
            await Post.findByIdAndUpdate({ _id: req.params.id }, {
                $push: { react: req.user['_id'] }
            })
        } else {
            await Post.findByIdAndUpdate({ _id: req.params.id }, {
                $pull: { react: req.user['_id'] }
            })
        }
        res.json({ message: 'Done' })
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
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
        await Attachment.deleteMany({ _id: { $in: post.attachment } })

        const listSavePost = await SavePost.find({ post: req.params.id })
        for (let i in listSavePost) {
            await SavePost.findByIdAndUpdate({ _id: listSavePost[i]._id }, {
                status: 3,
                status_type: 'delete'
            })
        }
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
        const { content } = req.body
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//12. Tắt thông báo bài viết
const changeNotify = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { isnotify } = req.body
        await Post.findByIdAndUpdate({ _id: req.params.id, }, {
            "isnotify": isnotify
        })
        return res.json({ 'message': "Done" })

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//13. Chuyển chế độ bài viết
const changePermisstion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ispublic } = req.body
        await Post.findByIdAndUpdate({ _id: req.params.id, }, {
            "ispublic": ispublic
        })
        const listSavePost = await SavePost.find({ post: req.params.id })
        console.log(listSavePost)
        if (ispublic == true) {
            for (let i in listSavePost) {
                await SavePost.findByIdAndUpdate({ _id: listSavePost[i]._id }, {
                    status: 1,
                    status_type: 'save'
                })
            }
        }
        else {
            for (let i in listSavePost) {
                await SavePost.findByIdAndUpdate({ _id: listSavePost[i]._id }, {
                    status: 2,
                    status_type: 'private'
                })
            }
        }
        return res.json({ 'message': "Done" })
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//14. Share bài viết
const SharePost = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
export default {
    createPost, getPosts, updatePost, getPost, reactPost,
    deletePost, savePost, unSavePost, getSavePost, getPostsUser,
    changeNotify, changePermisstion
}
