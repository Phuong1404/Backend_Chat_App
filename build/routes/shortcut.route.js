"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const shortcut_controller_1 = __importDefault(require("../controllers/shortcut.controller"));
const router = express_1.default.Router();
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
router.post('/', extractJWT_1.default, shortcut_controller_1.default.createShortcut);
router.get('/', extractJWT_1.default, shortcut_controller_1.default.getShortcut);
router.delete('/:id', extractJWT_1.default, shortcut_controller_1.default.deleteShortcut);
module.exports = router;
//# sourceMappingURL=shortcut.route.js.map