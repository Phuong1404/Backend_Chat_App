import * as express from 'express'
import controller from '../controllers/Message.controller'
const router = express.Router();
import extractJWT from '../middleware/extractJWT';

router.get('/channel/:id', extractJWT, controller.getMessageInChannel)

router.post('/send/:id', extractJWT, controller.chatMessageInChannel)

router.patch('/remove/:id', extractJWT, controller.removeMessage)

router.patch('/delete/:id', extractJWT, controller.deleteMessage)

export = router
