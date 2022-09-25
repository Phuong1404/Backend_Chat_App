"use strict";
const express = require("express");
const extractJWT_1 = require("../Middleware/extractJWT");
const Message_controller_1 = require("../Controllers/Message.controller");
const router = express.Router();
router.post('/send/:id', extractJWT_1.default, Message_controller_1.default.SendMessage);
router.get('/:id', extractJWT_1.default, Message_controller_1.default.GetChat);
router.post('/react/:message_id', extractJWT_1.default, Message_controller_1.default.ReactIcon);
router.put('/delete/:message_id', extractJWT_1.default, Message_controller_1.default.DeleteMessage);
router.put('/remove/:message_id', extractJWT_1.default, Message_controller_1.default.RemoveMessage);
module.exports = router;
//# sourceMappingURL=Message.route.js.map