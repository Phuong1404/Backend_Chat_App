"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const FriendRequest_controller_1 = __importDefault(require("../controllers/FriendRequest.controller"));
const router = express_1.default.Router();
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
router.post('/send', extractJWT_1.default, FriendRequest_controller_1.default.sendRequest);
router.delete('/reject/:id', extractJWT_1.default, FriendRequest_controller_1.default.RejectRequest);
router.delete('/cancel/:id', extractJWT_1.default, FriendRequest_controller_1.default.CancelRequest);
router.patch('/accept/:id', extractJWT_1.default, FriendRequest_controller_1.default.AcceptRequest);
router.get('/list', extractJWT_1.default, FriendRequest_controller_1.default.ListRequestRequest);
router.delete('/delete/:id', extractJWT_1.default, FriendRequest_controller_1.default.DeleteFriend);
module.exports = router;
//# sourceMappingURL=FriendRequest.route.js.map