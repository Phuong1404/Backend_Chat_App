import * as express from 'express'
import controller from '../controllers/Auth.controller'
const router = express.Router();
import extractJWT from '../middleware/extractJWT';

router.post("/register", controller.Register);

router.post("/login", controller.Login);

router.post("/logout", controller.Logout);

router.post("/refresh_token", controller.GenerateAccessToken);

router.patch("/changepass", extractJWT, controller.ChangePass)

export = router;
