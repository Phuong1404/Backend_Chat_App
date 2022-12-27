import express from 'express'
import controller from '../controllers/shortcut.controller'
const router = express.Router();
import extractJWT from '../middleware/extractJWT';

router.post('/', extractJWT, controller.createShortcut)
router.get('/', extractJWT, controller.getShortcut)
router.delete('/:id', extractJWT, controller.deleteShortcut)
export = router

