"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const SavePost_controller_1 = __importDefault(require("../controllers/SavePost.controller"));
const router = express_1.default.Router();
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
router.post('/', extractJWT_1.default, SavePost_controller_1.default.Save);
router.get('/:id', extractJWT_1.default, SavePost_controller_1.default.GetPost);
router.delete('/:id', extractJWT_1.default, SavePost_controller_1.default.Delete);
router.get('/', extractJWT_1.default, SavePost_controller_1.default.GetListPost);
module.exports = router;
//# sourceMappingURL=SavePost.route.js.map