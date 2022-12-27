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
const SavePost_model_1 = __importDefault(require("../models/SavePost.model"));
const Save = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post, user } = req.body;
        const newPost = new SavePost_model_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            user: [req.user['_id']],
            post: post,
            status: 1,
            status_type: 'save',
        });
        yield newPost.save();
        res.json({ message: 'Success' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
const Delete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const save_id = req.params.id;
        yield SavePost_model_1.default.findByIdAndDelete(save_id);
        res.json({ message: 'Success' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
const GetPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
const GetListPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Save1 = yield SavePost_model_1.default.find({ user: req.user['_id'] })
            .populate("user", "_id name avatar")
            .populate("post", "attachment user");
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
        ];
        const save2 = yield SavePost_model_1.default.populate(Save1, populateQuery);
        const save = yield SavePost_model_1.default.populate(save2, populateQuery1);
        res.json({
            result: save.length,
            save,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.default = {
    Save, Delete, GetPost, GetListPost
};
//# sourceMappingURL=SavePost.controller.js.map