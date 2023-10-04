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


//TODO: add Author

//TODO:delete Author

//TODO:Get Author with all his works details

//TODO:Update Author

export default router