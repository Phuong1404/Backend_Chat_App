import  express from 'express'
import controller from '../controllers/Message.controller'
const router = express.Router();
import extractJWT from '../middleware/extractJWT';
import uploadImage from '../middleware/uploadImage'

router.get('/channel/:id', extractJWT, controller.getMessageInChannel)

router.post('/send/:id', extractJWT, uploadImage.single('file'), controller.chatMessageInChannel)

router.patch('/remove/:id', extractJWT, controller.removeMessage)

router.patch('/delete/:id', extractJWT, controller.deleteMessage)

router.patch('/react/:id', extractJWT, controller.reactMessage)

router.get('/read/:id', extractJWT, controller.getMessageInChannel)
export = router
