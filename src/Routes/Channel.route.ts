import * as express from 'express'
import extractJWT from '../Middleware/extractJWT';
import controller from '../Controllers/Channel.controller'

const router = express.Router();

router.post('/creat/channel', extractJWT, controller.CreateChannel)

export = router
