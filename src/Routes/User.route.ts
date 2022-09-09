import * as express from 'express'
import extractJWT from '../Middleware/extractJWT';
import controller from '../Controllers/User.controller'

const router = express.Router();

router.get('/validate', extractJWT, controller.validateToken);
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/get/info', extractJWT, controller.getUser);
router.get('/get/contact', extractJWT, controller.getContactUser)
router.get('/get/channel', extractJWT, controller.getChannelUser)
router.put('/update/password', extractJWT, controller.changePassword)
router.put('/update/info', extractJWT, controller.changeInfomation)
export = router
