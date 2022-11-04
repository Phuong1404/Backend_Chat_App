"use strict";
const express = require("express");
const Notification_controller_1 = require("../controllers/Notification.controller");
const router = express.Router();
const extractJWT_1 = require("../middleware/extractJWT");
router.post('/', extractJWT_1.default, Notification_controller_1.default.createNotify);
router.delete('/:id', extractJWT_1.default, Notification_controller_1.default.deleteNotify);
router.get('/', extractJWT_1.default, Notification_controller_1.default.getNotify);
router.patch('/isread/:id', extractJWT_1.default, Notification_controller_1.default.isReadNotify);
module.exports = router;
//# sourceMappingURL=Notification.route.js.map