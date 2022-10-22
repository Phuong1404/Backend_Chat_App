import * as express from 'express'
import controller from '../controllers/User.controller'
const router = express.Router();
import extractJWT from '../middleware/extractJWT';
import uploadImage from '../Middleware/uploadImage'

router.get("/get/:id", extractJWT, controller.getUser)
router.get("/search", extractJWT, controller.searchUser)
router.patch("/update", extractJWT, uploadImage.single("avatar"), controller.updateUser)

export = router
