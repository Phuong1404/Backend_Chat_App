"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const md5_1 = __importDefault(require("md5"));
const moment_1 = __importDefault(require("moment"));
const maxSize = 20 * 1024 * 1024;
const storage = multer_1.default.diskStorage({
    filename: function (req, file, cb) {
        cb(null, `${(0, md5_1.default)(String(file.originalname) + String((0, moment_1.default)()))}`);
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: maxSize },
});
exports.default = upload;
//# sourceMappingURL=uploadImage.js.map