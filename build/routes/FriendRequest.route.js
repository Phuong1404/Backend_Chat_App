"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express = __importStar(require("express"));
const FriendRequest_controller_1 = __importDefault(require("../controllers/FriendRequest.controller"));
const router = express.Router();
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
router.post('/send', extractJWT_1.default, FriendRequest_controller_1.default.sendRequest);
router.delete('/reject/:id', extractJWT_1.default, FriendRequest_controller_1.default.RejectRequest);
router.delete('/cancel/:id', extractJWT_1.default, FriendRequest_controller_1.default.CancelRequest);
router.patch('/accept/:id', extractJWT_1.default, FriendRequest_controller_1.default.AcceptRequest);
router.get('/list', extractJWT_1.default, FriendRequest_controller_1.default.ListRequestRequest);
router.delete('/delete/:id', extractJWT_1.default, FriendRequest_controller_1.default.DeleteFriend);
module.exports = router;
//# sourceMappingURL=FriendRequest.route.js.map