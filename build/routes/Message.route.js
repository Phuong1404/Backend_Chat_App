"use strict";
const express = require("express");
const Message_controller_1 = require("../controllers/Message.controller");
const router = express.Router();
const extractJWT_1 = require("../middleware/extractJWT");
const uploadImage_1 = require("../Middleware/uploadImage");
router.get('/channel/:id', extractJWT_1.default, Message_controller_1.default.getMessageInChannel);
router.post('/send/:id', extractJWT_1.default, uploadImage_1.default.single('file'), Message_controller_1.default.chatMessageInChannel);
router.patch('/remove/:id', extractJWT_1.default, Message_controller_1.default.removeMessage);
router.patch('/delete/:id', extractJWT_1.default, Message_controller_1.default.deleteMessage);
router.patch('/react/:id', extractJWT_1.default, Message_controller_1.default.reactMessage);
router.post('/read/:id', extractJWT_1.default, Message_controller_1.default.getMessageInChannel);
module.exports = router;
//# sourceMappingURL=Message.route.js.map