"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("multer");
const NAMESPACE = 'Upload';
const UploadFile = () => {
    const maxSize = 20 * 1000 * 1000;
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./dist/public/files`);
        },
        filename: function (req, file, cb) {
            cb(null, `${file.originalname}`);
        },
    });
    const upload = multer({
        storage: storage,
        limits: { fileSize: maxSize },
    });
    return upload.array("listfile", 10);
};
exports.default = UploadFile;
//# sourceMappingURL=uploadImage.js.map