import multer from 'multer';
import  md5 from 'md5';
import moment from "moment";

const maxSize = 20 * 1024 * 1024
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, `${md5(String(file.originalname) + String(moment()))}`);
    },
})
const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
});


export default upload
