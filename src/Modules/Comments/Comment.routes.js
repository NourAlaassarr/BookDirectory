import { Router } from "express";
import { isAuth } from "../../Middleware/auth.js";
import { SystemRoles } from "../../utlis/SystemRoles.js";
import { asyncHandler } from '../../utlis/ErrorHandling.js'
import { multerFunction } from '../../Services/MulterLocal.js'
import { allowedExtensions } from "../../utlis/AllowedExtensions.js";
import{multerCloudFunction}from'../../Services/MulterCloud.js'
import * as CommentControllers from'./Comments.Controllers.js'
import {UserApi}from'./Comment.ApiEndPoint.js'
const router = Router()

//Add Like
router.post ('/AddLike',isAuth(UserApi.User_api),asyncHandler(CommentControllers.AddLike))

//Add
router.post ('/Add',isAuth(UserApi.User_api),asyncHandler(CommentControllers.Add))

//Update Comment
router.put ('/Update',isAuth(UserApi.User_api),asyncHandler(CommentControllers.Update))

//DeleteComment
router.delete ('/Delete',isAuth(UserApi.User_api),asyncHandler(CommentControllers.deleteComment))

//Unlike Comment
router.post ('/Unlike',isAuth(UserApi.User_api),asyncHandler(CommentControllers.UnLike))






export default router