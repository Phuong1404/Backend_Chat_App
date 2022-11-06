import { NextFunction, Request, Response } from "express";
import mongoose, { model } from 'mongoose';
import Comment from "../models/Comment.model";

//1. Tạo comment
const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//2. Cập nhật comment
const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//3. like comment
const likeComment = async (req: Request, res: Response, next: NextFunction) => {
    try {

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

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export default {
    createComment, updateComment, deleteComment,
    likeComment, unlikeComment
}
