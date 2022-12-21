"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Post_model_1 = __importDefault(require("../models/Post.model"));
const Comment_model_1 = __importDefault(require("../models/Comment.model"));
const Attachment_model_1 = __importDefault(require("../models/Attachment.model"));
const moment_1 = __importDefault(require("moment"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const NAMESPACE = "POST";
//1. Tạo bài post
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // upload.array("PhotosList", 6);
        const { content } = req.body;
        const files = req.files;
        if (content.length === 0 && !files) {
            return res.status(400).json({ msg: "Please add content or image." });
        }
        if (files) {
            let listAttachment = [];
            let attachmentId = [];
            for (let file in files) {
                const newAttachment = new Attachment_model_1.default({
                    _id: new mongoose_1.default.Types.ObjectId(),
                    name: files[file].filename,
                    size: String(files[file].size),
                    format_type: files[file].mimetype,
                    type: 0,
                    type_name: "Image"
                });
                yield newAttachment.save();
                listAttachment.push(newAttachment);
                attachmentId.push(newAttachment.id);
            }
            const newPost = new Post_model_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                content: content,
                attachment: attachmentId,
                user: req.user['_id'],
                time: moment_1.default,
            });
            yield newPost.save().then((result) => __awaiter(void 0, void 0, void 0, function* () {
                if (result) {
                    for (let item in listAttachment) {
                        yield listAttachment[item].save();
                        //------------------------------------------------
                        cloudinary_1.default.v2.uploader.upload(files[item].path).then((result) => __awaiter(void 0, void 0, void 0, function* () {
                            yield Attachment_model_1.default.findByIdAndUpdate({ _id: listAttachment[item]._id }, {
                                link: result.url,
                                user: req.user['_id'],
                                res_model: "Post",
                                res_id: newPost._id
                            });
                        }));
                        //------------------------------------------------
                    }
                }
            })).catch((error) => {
                return res.status(500).json({ message: error.message });
            });
            res.json({ message: 'Success' });
        }
        else {
            const newPost = yield new Post_model_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                content: content,
                user: req.user['_id'],
                time: moment_1.default,
            });
            yield newPost.save();
            res.json({ message: 'Success' });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
//2. Lấy danh sách bài post
const getPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_model_1.default.find({
            user: [...req.user['friend'], req.user['_id']]
        }).sort("-createdAt")
            .populate("user", "name avatar")
            .populate("attachment", "-_id avatar");
        const populateQuery = [
            {
                path: 'user.avatar',
                select: '-_id link',
            },
        ];
        const post1 = yield Post_model_1.default.populate(post, populateQuery);
        res.json({
            result: post1.length,
            post1,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
const getPostsUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.params.id;
        const post = yield Post_model_1.default.find({
            user: user_id
        }).sort("-createdAt")
            .populate("user", "name avatar")
            .populate("attachment", "-_id avatar");
        const populateQuery = [
            {
                path: 'user.avatar',
                select: '-_id link',
            },
        ];
        const post1 = yield Post_model_1.default.populate(post, populateQuery);
        res.json({
            result: post1.length,
            post1,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
//3. Cập nhật bài post
const updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
//4. React post
//5. Unreact post
//6. Lấy 1 bài post
const getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_model_1.default.findById(req.params.id)
            .populate("user", "name avatar");
        if (!post)
            return res.status(400).json({ msg: "This post does not exits." });
        res.json({
            data: post,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
//7. 
//8. Xóa bài post
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_model_1.default.findOneAndDelete({
            _id: req.params.id,
        });
        yield Comment_model_1.default.deleteMany({ _id: { $in: post.comments } });
        res.json({
            message: "Deleted Post!"
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
//9. Lưu bài post
const savePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
//10. Bỏ lưu
const unSavePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
//11. Lấy danh sách lưu
const getSavePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.default = {
    createPost, getPosts, updatePost, getPost,
    deletePost, savePost, unSavePost, getSavePost, getPostsUser
};
//# sourceMappingURL=Post.controller.js.map