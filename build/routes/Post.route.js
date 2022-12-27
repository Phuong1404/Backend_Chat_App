"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const Post_controller_1 = __importDefault(require("../controllers/Post.controller"));
const router = express_1.default.Router();
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
const uploadImage_1 = __importDefault(require("../middleware/uploadImage"));
router.post('/', extractJWT_1.default, uploadImage_1.default.array("files", 6), Post_controller_1.default.createPost);
router.get('/', extractJWT_1.default, Post_controller_1.default.getPosts);
router.patch('/:id', extractJWT_1.default, uploadImage_1.default.array("files", 6), Post_controller_1.default.updatePost);
router.get('/:id', extractJWT_1.default, Post_controller_1.default.getPost);
router.delete('/:id', extractJWT_1.default, Post_controller_1.default.deletePost);
router.post('/savepost/:id', extractJWT_1.default, Post_controller_1.default.savePost);
router.patch('/unsavepost/:id', extractJWT_1.default, Post_controller_1.default.unSavePost);
router.get('/getsavepost', extractJWT_1.default, Post_controller_1.default.getSavePost);
router.get('/user/:id', extractJWT_1.default, Post_controller_1.default.getPostsUser);
router.get('/react/:id', extractJWT_1.default, Post_controller_1.default.reactPost);
router.patch('/notify/:id', extractJWT_1.default, Post_controller_1.default.changeNotify);
router.patch('/public/:id', extractJWT_1.default, Post_controller_1.default.changePermisstion);
module.exports = router;
//# sourceMappingURL=Post.route.js.map