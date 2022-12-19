import express from 'express'
import controller from '../controllers/Post.controller'
const router = express.Router();
import extractJWT from '../middleware/extractJWT';
import uploadImage from '../middleware/uploadImage'

router.post('/', extractJWT, uploadImage.array("files", 6), controller.createPost)
router.get('/', extractJWT, controller.getPosts)
router.patch('/:id', extractJWT, controller.updatePost)
router.get('/:id', extractJWT, controller.getPost)
router.delete('/:id', extractJWT, controller.deletePost)
router.post('/savepost/:id', extractJWT, controller.savePost)
router.patch('/unsavepost/:id', extractJWT, controller.unSavePost)
router.get('/getsavepost', extractJWT, controller.getSavePost)
router.get('user/:id', extractJWT, controller.getPostsUser)
export = router

