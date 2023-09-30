import { Router } from "express";
import { isAuth } from "../../Middleware/auth.js";
import * as AuthControllers from'./Auth.Controllers.js'
import { SystemRoles } from "../../utlis/SystemRoles.js";
import {asyncHandler}from'../../utlis/ErrorHandling.js'
const router=Router()

router.post('/SignUp',asyncHandler(AuthControllers.SignUp))
router.get('/confirm/:Token',asyncHandler(AuthControllers.ConfirmEmail))
router.post('/SignIn',asyncHandler(AuthControllers.SignIn))
router.put('/Update',isAuth(),asyncHandler(AuthControllers.Update))
router.patch('/UpdatePassword',isAuth(),asyncHandler(AuthControllers.UpdatePassword))
router.get('/GetProfile',isAuth(),asyncHandler(AuthControllers.GetProfile))
router.patch('/SoftDelete',isAuth(),asyncHandler(AuthControllers.SoftDelete))



export default router