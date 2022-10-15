import * as express from 'express'
import controller from '../controllers/User.controller'
const router = express.Router();
import extractJWT from '../middleware/extractJWT';

router.get("/get/:id",extractJWT,controller.getUser)
router.get("/search",extractJWT,controller.searchUser)
router.patch("/update",extractJWT,controller.updateUser)

export=router
