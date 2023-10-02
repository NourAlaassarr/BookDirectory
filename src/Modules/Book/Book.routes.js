import { Router } from "express";
import { isAuth } from "../../Middleware/auth.js";
import { SystemRoles } from "../../utlis/SystemRoles.js";
import { asyncHandler } from '../../utlis/ErrorHandling.js'
import { multerFunction } from '../../Services/MulterLocal.js'
import { allowedExtensions } from "../../utlis/AllowedExtensions.js";
import * as BookControllers from'./Book.Controllers.js'
import * as roles from'./Book..apiEndpoint.js'
const router = Router()

router.post('/Add',isAuth(roles.BookApiRoles.ADD_BOOK),asyncHandler(BookControllers.Add_Book))
router.delete('/Delete',isAuth(roles.BookApiRoles.DELETE_BOOK),asyncHandler(BookControllers.DeleteBook))


export default router