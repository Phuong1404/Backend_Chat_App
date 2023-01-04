"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const User_controller_1 = __importDefault(require("../controllers/User.controller"));
const router = express_1.default.Router();
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
const uploadImage_1 = __importDefault(require("../middleware/uploadImage"));
router.get("/get/:id", extractJWT_1.default, User_controller_1.default.getUser);
router.get("/search", extractJWT_1.default, User_controller_1.default.searchUser);
router.patch("/update", extractJWT_1.default, uploadImage_1.default.single("avatar"), User_controller_1.default.updateUser);
// router.patch("/update", extractJWT, uploadImage.array("images", 2), controller.updateUser)
router.get("/getinfo", extractJWT_1.default, User_controller_1.default.getMyUser);
router.get("/getfiend", extractJWT_1.default, User_controller_1.default.listFriend);
router.get("/get/public/:id", User_controller_1.default.getUserPublic);
router.get("/suggestion", extractJWT_1.default, User_controller_1.default.suggestionUser);
router.get("/not/friend", extractJWT_1.default, User_controller_1.default.allUserNotFriend);
router.get("/listimage/:id", extractJWT_1.default, User_controller_1.default.getListImageUser);
router.get("/getfiend/:id", extractJWT_1.default, User_controller_1.default.listFriendUser);
module.exports = router;
//# sourceMappingURL=User.route.js.map