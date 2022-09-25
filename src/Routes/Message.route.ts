import * as express from 'express'
import extractJWT from '../Middleware/extractJWT';
import controller from '../Controllers/Message.controller'

const router = express.Router();
router.post('/send/:id', extractJWT, controller.SendMessage)
router.get('/:id', extractJWT, controller.GetChat)
router.post('/react/:message_id', extractJWT, controller.ReactIcon)
router.put('/delete/:message_id', extractJWT, controller.DeleteMessage)
router.put('/remove/:message_id', extractJWT, controller.RemoveMessage)
export = router
