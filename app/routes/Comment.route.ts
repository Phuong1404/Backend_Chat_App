import * as express from 'express'
import controller from '../controllers/Comment.controller'
const router = express.Router();
import extractJWT from '../middleware/extractJWT';
import uploadImage from '../Middleware/uploadImage'


router.post('/', extractJWT, controller.createComment)
router.patch('/:id', extractJWT, controller.updateComment)
router.delete('/:id', extractJWT, controller.deleteComment)
router.patch('/like/:id', extractJWT, controller.likeComment)
router.patch('/unlike/:id', extractJWT, controller.unlikeComment)

export = router
