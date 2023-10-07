import { Router } from "express";
import { isAuth } from "../../Middleware/auth.js";
import { SystemRoles } from "../../utlis/SystemRoles.js";
import { asyncHandler } from '../../utlis/ErrorHandling.js'
import { multerFunction } from '../../Services/MulterLocal.js'
import { allowedExtensions } from "../../utlis/AllowedExtensions.js";
import * as ReplControllers from'./Reply.Controllers.js'
import {UserApi}from'./Reply.Api.Endpoints'
const router = Router()

//Add Reply 
router.post('/Add',isAuth(UserApi.User_api),asyncHandler(ReplControllers.AddReply))

// Delete Reply 
router.delete('/delete',isAuth(UserApi.User_api),asyncHandler(ReplControllers.DeleteReply))
//UpdateComment
router.patch('/Update',isAuth(UserApi.User_api),asyncHandler(ReplControllers.UpdateComment))


export default router