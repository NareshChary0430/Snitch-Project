import express from 'express';
import {registerValidator,loginValidator} from "../validators/auth.validator.js";
import {register,login,refresh,getMe} from "../controller/auth.controller.js";
import {authenticate} from "../middlewares/auth.middleware.js";

const router = express.Router();



/**
 * @POST /api/auth/register
 * @param req Express req
 * @param req.body = {email,name,password}
 * @response res.status  = 201 (if successfull)
 * 
 */

router.post('/register', registerValidator,register); 

/**
 * @POST /api/auth/login
 * @param req Express req
 * @param req.body = {email,password}
 * @response res.status  = 200 (if successfull)
 * 
 */


router.post('/login', loginValidator,login);

/**
 * @POST /api/auth/refresh
 * @param req Express req
 * @param req.body = {refreshToken}
 * @response res.status  = 200 (if successfull)
 * 
 */

router.post('/refresh',refresh )


/**
 * @GET /api/auth/me
 * @param req Express req
 * @param req.user Object
 * @param req.user.userId String
 * @param res Express res
 * @returns {Object} Object containing user data
 */

router.get('/me',authenticate,getMe);


export default router;