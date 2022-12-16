import  express from 'express'
import controller from '../controllers/Channel.controller'
const router = express.Router();
import extractJWT from '../middleware/extractJWT';

router.post('/create', extractJWT, controller.createChannel)

router.patch('/add/:id', extractJWT, controller.addUserToChannel)

router.patch('/delete/:id', extractJWT, controller.removeUserToChannel)

router.patch('/update/:id', extractJWT, controller.updateChannel)

router.get('/:id', extractJWT, controller.getChannel)

router.patch('/leave/:id', extractJWT, controller.leaveChannel)

router.get('/get/mylist', extractJWT, controller.MyListChannel)
export = router
