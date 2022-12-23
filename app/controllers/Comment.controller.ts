import { NextFunction, Request, Response } from "express";
import mongoose, { model } from 'mongoose';
import Comment from "../models/Comment.model";
import Attachment from "../models/Attachment.model";
import Post from "../models/Post.model";
import moment from "moment";
import cloudinary from 'cloudinary'
const NAMESPACE = "COMMENT"

//1. Tạo comment
const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tag, parent_comment, content } = req.body
        const post_id = req.params.id
        const files = req.files
        if (tag && content.length === 0 && !files) {
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
            const newComment = await new Comment({
                _id: new mongoose.Types.ObjectId(),
                content: content,
                tag: tag,
                parent_comment: parent_comment,
                post_id: post_id,
                user: req.user['_id'],
                attachment: attachmentId,
                time: moment,
            })

            await newComment.save().then(async (result) => {
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
                                    res_model: "Comment",
                                    res_id: newComment._id
                                }
                            )
                        })
                        //------------------------------------------------
                    }
                }
            }).catch((error) => {
                return res.status(500).json({ message: error.message });
            })
            await Post.findByIdAndUpdate({ _id: post_id },
                {
                    $push: { comments: newComment._id }
                })
            res.json({ message: 'Success' })
        }
        else {
            const newComment = await new Comment({
                _id: new mongoose.Types.ObjectId(),
                content: content,
                tag: tag,
                parent_comment: parent_comment,
                post_id: post_id,
                user: req.user['_id'],
                time: moment,
            })
            await newComment.save()
            await Post.findByIdAndUpdate({ _id: post_id },
                {
                    $push: { comments: newComment._id }
                })
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//2. Cập nhật comment
const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { content } = req.body
        const comment = await Comment.findByIdAndUpdate({ _id: req.params.id }, {
            content: content
        })
        res.json({message:"Done"})

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//3. like comment
const likeComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comment = await Comment.findById(req.params.id)
        const is_react = comment.react.find(react => String(react) == String(req.user['_id']))
        if (!is_react) {
            await Comment.findByIdAndUpdate({ _id: req.params.id }, {
                $push: { react: req.user['_id'] }
            })
        } else {
            await Comment.findByIdAndUpdate({ _id: req.params.id }, {
                $pull: { react: req.user['_id'] }
            })
        }
        res.json({ message: 'Done' })
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//4. unlike comment
const unlikeComment = async (req: Request, res: Response, next: NextFunction) => {
    try {

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//5. xóa comment
const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comment = await Comment.findOneAndDelete({
            _id: req.params.id,
        });

        res.json({
            message: "Deleted Post!"
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//6. List comment
const getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post_id = req.params.id
        const comment = await Comment.find({
            post_id: post_id
        })
            .populate("attachment")
            .populate("user", "_id name avatar")
        res.json({
            result: comment.length,
            comment,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//7. Comment
const getComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comment_id = req.params.id
        const comment = await Comment.find({
            _id: comment_id
        })
            .populate("attachment")
        res.json({
            result: comment.length,
            comment,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
export default {
    createComment, updateComment, deleteComment,
    likeComment, unlikeComment, getComments, getComment
}
