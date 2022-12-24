"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const Message_controller_1 = __importDefault(require("../controllers/Message.controller"));
const router = express_1.default.Router();
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
const uploadImage_1 = __importDefault(require("../middleware/uploadImage"));
router.get('/channel/:id', extractJWT_1.default, Message_controller_1.default.getMessageInChannel);
router.post('/send/:id', extractJWT_1.default, uploadImage_1.default.single('file'), Message_controller_1.default.chatMessageInChannel);
router.patch('/remove/:id', extractJWT_1.default, Message_controller_1.default.removeMessage);
router.patch('/delete/:id', extractJWT_1.default, Message_controller_1.default.deleteMessage);
router.patch('/react/:id', extractJWT_1.default, Message_controller_1.default.reactMessage);
router.get('/read/:id', extractJWT_1.default, Message_controller_1.default.getMessageInChannel);
module.exports = router;
//# sourceMappingURL=Message.route.js.map