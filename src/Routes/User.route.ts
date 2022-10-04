import * as express from 'express'
import extractJWT from '../Middleware/extractJWT';
import uploadImage from '../Middleware/uploadImage'
import controller from '../Controllers/User.controller'

const router = express.Router();

router.get('/validate', extractJWT, controller.validateToken);
router.post('/register',uploadImage(), controller.register);
router.post('/login', controller.login);
router.get('/get/info', extractJWT, controller.getUser);
router.get('/get/contact', extractJWT, controller.getContactUser)
router.get('/get/friend/send', extractJWT, controller.getListSendFriend);
router.get('/get/friend/receiver', extractJWT, controller.getListReceiverFriend)
router.get('/get/channel', extractJWT, controller.getChannelUser)
router.put('/update/password', extractJWT, controller.changePassword)
router.put('/update/info', extractJWT,uploadImage(), controller.changeInfomation)
router.post('/send/friend', extractJWT, controller.SendFriendRequest)
router.post('/cancel/friend', extractJWT, controller.CancelFriendRequest)
router.post('/accept/friend', extractJWT, controller.AcceptFriendRequest)

export = router
