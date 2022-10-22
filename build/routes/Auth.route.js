"use strict";
const express = require("express");
const Auth_controller_1 = require("../controllers/Auth.controller");
const router = express.Router();
const extractJWT_1 = require("../middleware/extractJWT");
const uploadImage_1 = require("../Middleware/uploadImage");
router.post("/register", uploadImage_1.default.single("avatar"), Auth_controller_1.default.Register);
router.post("/login", Auth_controller_1.default.Login);
router.post("/logout", Auth_controller_1.default.Logout);
router.post("/refresh_token", Auth_controller_1.default.GenerateAccessToken);
router.patch("/changepass", extractJWT_1.default, Auth_controller_1.default.ChangePass);
module.exports = router;
//# sourceMappingURL=Auth.route.js.map