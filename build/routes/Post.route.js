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
const Post_controller_1 = __importDefault(require("../controllers/Post.controller"));
const router = express.Router();
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
const uploadImage_1 = __importDefault(require("../Middleware/uploadImage"));
router.post('/', extractJWT_1.default, uploadImage_1.default.array("files", 6), Post_controller_1.default.createPost);
router.get('/', extractJWT_1.default, Post_controller_1.default.getPosts);
router.patch('/:id', extractJWT_1.default, Post_controller_1.default.updatePost);
router.get('/:id', extractJWT_1.default, Post_controller_1.default.getPost);
router.delete('/:id', extractJWT_1.default, Post_controller_1.default.deletePost);
router.post('/savepost/:id', extractJWT_1.default, Post_controller_1.default.savePost);
router.patch('/unsavepost/:id', extractJWT_1.default, Post_controller_1.default.unSavePost);
router.get('/getsavepost', extractJWT_1.default, Post_controller_1.default.getSavePost);
module.exports = router;
//# sourceMappingURL=Post.route.js.map