"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("multer");
const md5 = require("md5");
const moment = require("moment");
const maxSize = 20 * 1024 * 1024;
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, `${md5(String(file.originalname) + String(moment()))}`);
    },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
});
exports.default = upload;
//# sourceMappingURL=uploadImage.js.map