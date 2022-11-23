"use strict";
const express = require("express");
const FriendRequest_controller_1 = require("../controllers/FriendRequest.controller");
const router = express.Router();
const extractJWT_1 = require("../middleware/extractJWT");
router.post('/send', extractJWT_1.default, FriendRequest_controller_1.default.sendRequest);
router.delete('/reject/:id', extractJWT_1.default, FriendRequest_controller_1.default.RejectRequest);
router.delete('/cancel/:id', extractJWT_1.default, FriendRequest_controller_1.default.CancelRequest);
router.patch('/accept/:id', extractJWT_1.default, FriendRequest_controller_1.default.AcceptRequest);
router.get('/list', extractJWT_1.default, FriendRequest_controller_1.default.ListRequestRequest);
module.exports = router;
//# sourceMappingURL=FriendRequest.route.js.map