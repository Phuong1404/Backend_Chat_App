"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const Notification_controller_1 = __importDefault(require("../controllers/Notification.controller"));
const router = express_1.default.Router();
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
router.post('/', extractJWT_1.default, Notification_controller_1.default.createNotify);
router.delete('/:id', extractJWT_1.default, Notification_controller_1.default.deleteNotify);
router.get('/', extractJWT_1.default, Notification_controller_1.default.getNotify);
router.patch('/isread/:id', extractJWT_1.default, Notification_controller_1.default.isReadNotify);
module.exports = router;
//# sourceMappingURL=Notification.route.js.map