import * as express from 'express'
import controller from '../controllers/Notification.controller'
const router = express.Router();
import extractJWT from '../middleware/extractJWT';
import uploadImage from '../Middleware/uploadImage'

router.post('/', extractJWT, controller.createNotify)

router.delete('/:id', extractJWT, controller.deleteNotify)

router.get('/', extractJWT, controller.getNotify)

router.patch('/isread/:id', extractJWT, controller.isReadNotify)

export = router
