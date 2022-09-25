"use strict";
const express = require("express");
const extractJWT_1 = require("../Middleware/extractJWT");
const Channel_controller_1 = require("../Controllers/Channel.controller");
const router = express.Router();
router.post('/create', extractJWT_1.default, Channel_controller_1.default.CreateChannel);
router.put('/out/:id', extractJWT_1.default, Channel_controller_1.default.OutChannel);
router.post('/adduser/:id', extractJWT_1.default, Channel_controller_1.default.AddToChannel);
module.exports = router;
//# sourceMappingURL=Channel.route.js.map