"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const Comment_controller_1 = __importDefault(require("../controllers/Comment.controller"));
const router = express_1.default.Router();
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
const uploadImage_1 = __importDefault(require("../middleware/uploadImage"));
router.post('/:id', extractJWT_1.default, uploadImage_1.default.array("files", 6), Comment_controller_1.default.createComment);
router.patch('/:id', extractJWT_1.default, Comment_controller_1.default.updateComment);
router.delete('/:id', extractJWT_1.default, Comment_controller_1.default.deleteComment);
router.patch('/like/:id', extractJWT_1.default, Comment_controller_1.default.likeComment);
router.patch('/unlike/:id', extractJWT_1.default, Comment_controller_1.default.unlikeComment);
router.get('/:id', extractJWT_1.default, Comment_controller_1.default.getComment);
router.get('/bypost/:id', extractJWT_1.default, Comment_controller_1.default.getComments);
module.exports = router;
//# sourceMappingURL=Comment.route.js.map