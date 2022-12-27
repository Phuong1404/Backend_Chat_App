import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose';

import SavePost from "../models/SavePost.model";

const Save = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { post, user } = req.body
        const newPost = new SavePost({
            _id: new mongoose.Types.ObjectId(),
            user: [req.user['_id']],
            post: post,
            status: 1,
            status_type: 'save',
        })
        await newPost.save()
        res.json({ message: 'Success' })
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const Delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const save_id = req.params.id
        await SavePost.findByIdAndDelete(save_id)
        res.json({ message: 'Success' })
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const GetPost = async (req: Request, res: Response, next: NextFunction) => {
    try {

    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const GetListPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const Save1 = await SavePost.find({ user: req.user['_id'] })
        .populate("user", "_id name avatar")
        .populate("post","attachment user")
        const populateQuery = [
            {
                path: 'user.avatar',
                select: '-_id link',
            },
            {
                path: 'post.user',
                select: '_id name avatar',
            },
        ];
        const populateQuery1 = [
            {
                path: 'post.user.avatar',
                select: '-_id link',
            },
        ]
        const save2 = await SavePost.populate(Save1, populateQuery);
        const save = await SavePost.populate(save2, populateQuery1);
        res.json({
            result: save.length,
            save,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export default {
    Save, Delete, GetPost, GetListPost
}
