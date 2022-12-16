"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Comment_model_1 = __importDefault(require("../models/Comment.model"));
const Attachment_model_1 = __importDefault(require("../models/Attachment.model"));
const Post_model_1 = __importDefault(require("../models/Post.model"));
const moment_1 = __importDefault(require("moment"));
const cloudinary = __importStar(require("cloudinary"));
const logging_1 = __importDefault(require("../config/logging"));
const NAMESPACE = "COMMENT";
//1. Tạo comment
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tag, parent_comment, content } = req.body;
        const post_id = req.params.id;
        const files = req.files;
        if (tag && content.length === 0 && !files) {
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
                listAttachment.push(newAttachment);
                attachmentId.push(newAttachment.id);
            }
            const newComment = yield new Comment_model_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                content: content,
                tag: tag,
                parent_comment: parent_comment,
                post_id: post_id,
                user: req.user['_id'],
                attachment: attachmentId,
                time: moment_1.default,
            });
            yield newComment.save().then((result) => __awaiter(void 0, void 0, void 0, function* () {
                if (result) {
                    for (let item in listAttachment) {
                        yield listAttachment[item].save();
                        //------------------------------------------------
                        cloudinary.v2.uploader.upload(files[item].path).then((result) => __awaiter(void 0, void 0, void 0, function* () {
                            yield Attachment_model_1.default.findByIdAndUpdate({ _id: listAttachment[item]._id }, {
                                link: result.url,
                                user: req.user['_id'],
                                res_model: "Comment",
                                res_id: newComment._id
                            });
                        }));
                        //------------------------------------------------
                    }
                }
            })).catch((error) => {
                logging_1.default.error(NAMESPACE, error.message, error);
                return res.status(500).json({ message: error.message });
            });
            yield Post_model_1.default.findByIdAndUpdate({ _id: post_id }, {
                $push: { comments: newComment._id }
            });
            res.json({ message: 'Success' });
        }
        else {
            const newComment = yield new Comment_model_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                content: content,
                tag: tag,
                parent_comment: parent_comment,
                post_id: post_id,
                user: req.user['_id'],
                time: moment_1.default,
            });
            yield newComment.save();
            yield Post_model_1.default.findByIdAndUpdate({ _id: post_id }, {
                $push: { comments: newComment._id }
            });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
//2. Cập nhật comment
const updateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
//3. like comment
const likeComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
//4. unlike comment
const unlikeComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
//5. xóa comment
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
//6. List comment
const getComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post_id = req.params.id;
        const comment = yield Comment_model_1.default.find({
            post_id: post_id
        })
            .populate("attachment")
            .populate("user", "_id name avatar");
        res.json({
            result: comment.length,
            comment,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
//7. Comment
const getComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment_id = req.params.id;
        const comment = yield Comment_model_1.default.find({
            _id: comment_id
        })
            .populate("attachment");
        res.json({
            result: comment.length,
            comment,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.default = {
    createComment, updateComment, deleteComment,
    likeComment, unlikeComment, getComments, getComment
};
//# sourceMappingURL=Comment.controller.js.map