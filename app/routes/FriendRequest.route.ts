import * as express from 'express'
import controller from '../controllers/FriendRequest.controller'
const router = express.Router();
import extractJWT from '../middleware/extractJWT';

router.post('/send', extractJWT, controller.sendRequest)

router.delete('/reject/:id', extractJWT, controller.RejectRequest)

router.delete('/cancel/:id', extractJWT, controller.CancelRequest)

router.patch('/accept/:id', extractJWT, controller.AcceptRequest)
export = router
