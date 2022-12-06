import * as express from 'express'
import controller from '../controllers/User.controller'
const router = express.Router();
import extractJWT from '../middleware/extractJWT';
import uploadImage from '../Middleware/uploadImage'

router.get("/get/:id", extractJWT, controller.getUser)
router.get("/search", extractJWT, controller.searchUser)
router.patch("/update", extractJWT, uploadImage.single("avatar"), controller.updateUser)
// router.patch("/update", extractJWT, uploadImage.array("images", 2), controller.updateUser)
router.get("/getinfo", extractJWT, controller.getMyUser)
router.get("/getfiend", extractJWT, controller.listFriend)
router.get("/get/public/:id", controller.getUserPublic)
export = router
