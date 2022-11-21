"use strict";
const express = require("express");
const User_controller_1 = require("../controllers/User.controller");
const router = express.Router();
const extractJWT_1 = require("../middleware/extractJWT");
const uploadImage_1 = require("../Middleware/uploadImage");
router.get("/get/:id", User_controller_1.default.getUser);
router.get("/search", extractJWT_1.default, User_controller_1.default.searchUser);
router.patch("/update", extractJWT_1.default, uploadImage_1.default.single("avatar"), User_controller_1.default.updateUser);
router.get("/getinfo", extractJWT_1.default, User_controller_1.default.getMyUser);
module.exports = router;
//# sourceMappingURL=User.route.js.map