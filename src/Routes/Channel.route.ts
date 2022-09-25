import * as express from 'express'
import extractJWT from '../Middleware/extractJWT';
import controller from '../Controllers/Channel.controller'

const router = express.Router();

router.post('/create', extractJWT, controller.CreateChannel)
router.put('/out/:id',extractJWT,controller.OutChannel)
router.post('/adduser/:id',extractJWT,controller.AddToChannel)

export = router
