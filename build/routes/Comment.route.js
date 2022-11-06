"use strict";
const express = require("express");
const Comment_controller_1 = require("../controllers/Comment.controller");
const router = express.Router();
const extractJWT_1 = require("../middleware/extractJWT");
router.post('/', extractJWT_1.default, Comment_controller_1.default.createComment);
router.patch('/:id', extractJWT_1.default, Comment_controller_1.default.updateComment);
router.delete('/:id', extractJWT_1.default, Comment_controller_1.default.deleteComment);
router.patch('/like/:id', extractJWT_1.default, Comment_controller_1.default.likeComment);
router.patch('/unlike/:id', extractJWT_1.default, Comment_controller_1.default.unlikeComment);
module.exports = router;
//# sourceMappingURL=Comment.route.js.map