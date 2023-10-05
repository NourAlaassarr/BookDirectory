import { Router } from "express";
import { isAuth } from "../../Middleware/auth.js";
import { SystemRoles } from "../../utlis/SystemRoles.js";
import { asyncHandler } from '../../utlis/ErrorHandling.js'
import { multerFunction } from '../../Services/MulterLocal.js'
import { allowedExtensions } from "../../utlis/AllowedExtensions.js";
import{multerCloudFunction}from'../../Services/MulterCloud.js'
import * as AuthorControllers from'./Author.Controllers.js'
import {UserApi}from'./Author.ApiEndpoints.js'
const router = Router()


//add Author
router.post('/Add',isAuth(UserApi.Admin),multerCloudFunction(allowedExtensions.Image).single('Pic'),asyncHandler(AuthorControllers.addAuthor))

//:delete Author
router.delete('/Delete',isAuth(UserApi.Admin),asyncHandler(AuthorControllers.DeleteAuthor))


//Get Author with all his works details
router.get('/GetAll',asyncHandler(AuthorControllers.GetAll))

//Update Author
router.put('/Update',isAuth(UserApi.Admin),multerCloudFunction(allowedExtensions.Image).single('Pic'),asyncHandler(AuthorControllers.Update))
export default router