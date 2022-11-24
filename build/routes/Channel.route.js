"use strict";
const express = require("express");
const Channel_controller_1 = require("../controllers/Channel.controller");
const router = express.Router();
const extractJWT_1 = require("../middleware/extractJWT");
router.post('/create', extractJWT_1.default, Channel_controller_1.default.createChannel);
router.patch('/add/:id', extractJWT_1.default, Channel_controller_1.default.addUserToChannel);
router.patch('/delete/:id', extractJWT_1.default, Channel_controller_1.default.removeUserToChannel);
router.patch('/update/:id', extractJWT_1.default, Channel_controller_1.default.updateChannel);
router.get('/:id', extractJWT_1.default, Channel_controller_1.default.getChannel);
router.patch('/leave/:id', extractJWT_1.default, Channel_controller_1.default.leaveChannel);
router.get('/get/mylist', extractJWT_1.default, Channel_controller_1.default.MyListChannel);
module.exports = router;
//# sourceMappingURL=Channel.route.js.map