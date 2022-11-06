import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose';
import User from '../models/User.model'

//1. Tạo bài post
const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//2. Lấy danh sách bài post
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {

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

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//7. 
//8. Xóa bài post
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {

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
