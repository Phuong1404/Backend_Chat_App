import express from 'express'
import controller from '../controllers/Post.controller'
const router = express.Router();
import extractJWT from '../middleware/extractJWT';
import uploadImage from '../middleware/uploadImage'

router.post('/', extractJWT, uploadImage.array("files", 6), controller.createPost)
router.get('/', extractJWT, controller.getPosts)
router.patch('/:id', extractJWT, uploadImage.array("files", 6), controller.updatePost)
router.get('/:id', extractJWT, controller.getPost)
router.delete('/:id', extractJWT, controller.deletePost)
router.post('/savepost/:id', extractJWT, controller.savePost)
router.patch('/unsavepost/:id', extractJWT, controller.unSavePost)
router.get('/getsavepost', extractJWT, controller.getSavePost)
router.get('/user/:id', extractJWT, controller.getPostsUser)
router.get('/react/:id', extractJWT, controller.reactPost)
router.patch('/notify/:id', extractJWT, controller.changeNotify)
router.patch('/public/:id', extractJWT, controller.changePermisstion)

export = router

