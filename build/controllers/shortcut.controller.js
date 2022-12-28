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
const shortcut_model_1 = __importDefault(require("../models/shortcut.model"));
//1. Tạo shortcut
const createShortcut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shortcut } = req.body;
        if (String(req.user['_id']) == String(shortcut)) {
            res.json({ "message": "Done" });
        }
        const short1 = yield shortcut_model_1.default.findOne({ shortcut: shortcut, user: req.user['_id'] });
        console.log(short1);
        if (short1) {
            yield shortcut_model_1.default.findByIdAndDelete(short1._id);
        }
        let newShortcut = new shortcut_model_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            user: req.user['_id'],
            shortcut: shortcut
        });
        yield newShortcut.save();
        let shortcut1 = yield shortcut_model_1.default.find({ user: req.user['_id'] })
            .sort("-createdAt");
        if (shortcut1.length > 6) {
            yield shortcut_model_1.default.findByIdAndDelete(shortcut1[6].id);
        }
        res.json({ "message": "Done" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
//2. Xóa shortcut
const deleteShortcut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield shortcut_model_1.default.findByIdAndDelete(id);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
//3. Get shortcut
const getShortcut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortcut1 = yield shortcut_model_1.default.find({ user: req.user['_id'] }).
            sort("-createdAt").
            populate('user', '_id name avatar').
            populate('shortcut', '_id name avatar');
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
        const shortcut = yield shortcut_model_1.default.populate(shortcut1, populateQuery);
        res.json({
            shortcut,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.default = { createShortcut, deleteShortcut, getShortcut };
//# sourceMappingURL=shortcut.controller.js.map