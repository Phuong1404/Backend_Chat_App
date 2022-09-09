"use strict";
const express = require("express");
const extractJWT_1 = require("../Middleware/extractJWT");
const User_controller_1 = require("../Controllers/User.controller");
const router = express.Router();
router.get('/validate', extractJWT_1.default, User_controller_1.default.validateToken);
router.post('/register', User_controller_1.default.register);
router.post('/login', User_controller_1.default.login);
router.get('/get/info', extractJWT_1.default, User_controller_1.default.getUser);
router.get('/get/contact', extractJWT_1.default, User_controller_1.default.getContactUser);
router.get('/get/channel', extractJWT_1.default, User_controller_1.default.getChannelUser);
router.put('/update/password', extractJWT_1.default, User_controller_1.default.changePassword);
router.put('/update/info', extractJWT_1.default, User_controller_1.default.changeInfomation);
module.exports = router;
//# sourceMappingURL=User.route.js.map