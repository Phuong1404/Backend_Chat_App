import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose';
import Notification from "../models/Notification.model";

const createNotify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, receiver, url, text, content, image } = req.body;

        if (receiver.includes(req.user['_id'].toString())) return;

        const notify = await new Notification({
            id,
            receiver,
            url,
            text,
            content,
            image,
            user: req.user['_id'],
        });
        await notify.save();
        return res.json({ notify });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

const deleteNotify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notify = await Notification.findOneAndDelete({
            id: req.params.id,
            url: req.query.url,
        });
        return res.json({ notify });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

const getNotify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifies = await Notification.find({ receiver: req.user['_id'] })
            .sort("-createdAt")
            .populate("user", "password");
        return res.json({ notifies });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

const isReadNotify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifies = await Notification.findOneAndUpdate(
            { _id: req.params.id },
            {
                isRead: true,
            }
        );

        return res.json({ notifies });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}
export default {
    isReadNotify, getNotify, deleteNotify, createNotify
}
