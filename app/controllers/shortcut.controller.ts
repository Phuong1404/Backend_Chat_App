import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose';

import ShortCut from "../models/shortcut.model";
import User from '../models/User.model'

//1. Tạo shortcut
const createShortcut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { shortcut } = req.body
        if (String(req.user['_id']) == String(shortcut)) {
            res.json({ "message": "Done" })
        }
        else {
            const short1 = await ShortCut.findOne({ shortcut: shortcut, user: req.user['_id'] })
            if (short1) {
                await ShortCut.findByIdAndDelete(short1._id)
            }
            let newShortcut = new ShortCut({
                _id: new mongoose.Types.ObjectId(),
                user: req.user['_id'],
                shortcut: shortcut
            })
            await newShortcut.save()
            let shortcut1 = await ShortCut.find({ user: req.user['_id'] })
                .sort("-createdAt")
            if (shortcut1.length > 6) {
                await ShortCut.findByIdAndDelete(shortcut1[6].id)
            }
            res.json({ "message": "Done" })
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//2. Xóa shortcut
const deleteShortcut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        await ShortCut.findByIdAndDelete(id)
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//3. Get shortcut
const getShortcut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shortcut1 = await ShortCut.find({ user: req.user['_id'] }).
            sort("-createdAt").
            populate('user', '_id name avatar').
            populate('shortcut', '_id name avatar')

        const populateQuery = [
            {
                path: 'user.avatar',
                select: '-_id link',
            },
            {
                path: 'shortcut.avatar',
                select: '-_id link',
            },
        ];
        const shortcut = await ShortCut.populate(shortcut1, populateQuery);
        res.json({
            shortcut,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
export default { createShortcut, deleteShortcut, getShortcut }
