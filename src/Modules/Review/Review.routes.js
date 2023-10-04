import { Router } from "express";
import { isAuth } from "../../Middleware/auth.js";
import { SystemRoles } from "../../utlis/SystemRoles.js";
import { asyncHandler } from '../../utlis/ErrorHandling.js'
import { multerFunction } from '../../Services/MulterLocal.js'
import { allowedExtensions } from "../../utlis/AllowedExtensions.js";
import{multerCloudFunction}from'../../Services/MulterCloud.js'
import * as ReviewControllers from'./Reviw.Controllers.js'
import {UserApi}from'./Review.apiendpoints.js'
const router =Router()

//Add review(1-5)
router.post('/Add',isAuth(UserApi.User_api),
asyncHandler(ReviewControllers.AddReview))


export default router