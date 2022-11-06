"use strict";
const express = require("express");
const Post_controller_1 = require("../controllers/Post.controller");
const router = express.Router();
const extractJWT_1 = require("../middleware/extractJWT");
router.post('/', extractJWT_1.default, Post_controller_1.default.createPost);
router.get('/', extractJWT_1.default, Post_controller_1.default.getPosts);
router.patch('/:id', extractJWT_1.default, Post_controller_1.default.updatePost);
router.get('/:id', extractJWT_1.default, Post_controller_1.default.getPost);
router.delete('/:id', extractJWT_1.default, Post_controller_1.default.deletePost);
router.post('/savepost/:id', extractJWT_1.default, Post_controller_1.default.savePost);
router.patch('/unsavepost/:id', extractJWT_1.default, Post_controller_1.default.unSavePost);
router.get('/getsavepost', extractJWT_1.default, Post_controller_1.default.getSavePost);
module.exports = router;
//# sourceMappingURL=Post.router.js.map