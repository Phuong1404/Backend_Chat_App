"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const Auth_controller_1 = __importDefault(require("../controllers/Auth.controller"));
const router = express_1.default.Router();
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
const uploadImage_1 = __importDefault(require("../middleware/uploadImage"));
router.post("/register", uploadImage_1.default.single("avatar"), Auth_controller_1.default.Register);
router.post("/login", Auth_controller_1.default.Login);
router.post("/logout", Auth_controller_1.default.Logout);
router.post("/refresh_token", Auth_controller_1.default.GenerateAccessToken);
router.patch("/changepass", extractJWT_1.default, Auth_controller_1.default.ChangePass);
router.post("/resetpass", Auth_controller_1.default.ResetPassword);
module.exports = router;
//# sourceMappingURL=Auth.route.js.map