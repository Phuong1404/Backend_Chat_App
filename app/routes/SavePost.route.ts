import express from 'express'
import controller from '../controllers/SavePost.controller'
const router = express.Router();
import extractJWT from '../middleware/extractJWT';

router.post('/', extractJWT, controller.Save)
router.get('/:id', extractJWT, controller.GetPost)
router.delete('/:id', extractJWT, controller.Delete)
router.get('/',extractJWT,controller.GetListPost)
export = router

