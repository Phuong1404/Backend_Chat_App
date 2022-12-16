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
const Comment_controller_1 = __importDefault(require("../controllers/Comment.controller"));
const router = express.Router();
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
const uploadImage_1 = __importDefault(require("../Middleware/uploadImage"));
router.post('/:id', extractJWT_1.default, uploadImage_1.default.array("files", 6), Comment_controller_1.default.createComment);
router.patch('/:id', extractJWT_1.default, Comment_controller_1.default.updateComment);
router.delete('/:id', extractJWT_1.default, Comment_controller_1.default.deleteComment);
router.patch('/like/:id', extractJWT_1.default, Comment_controller_1.default.likeComment);
router.patch('/unlike/:id', extractJWT_1.default, Comment_controller_1.default.unlikeComment);
router.get('/:id', extractJWT_1.default, Comment_controller_1.default.getComment);
router.get('/bypost/:id', extractJWT_1.default, Comment_controller_1.default.getComments);
module.exports = router;
//# sourceMappingURL=Comment.route.js.map