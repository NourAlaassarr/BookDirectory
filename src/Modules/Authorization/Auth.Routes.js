import { Router } from "express";
import { isAuth } from "../../Middleware/auth.js";
import * as AuthControllers from './Auth.Controllers.js'
import { SystemRoles } from "../../utlis/SystemRoles.js";
import { asyncHandler } from '../../utlis/ErrorHandling.js'
import { multerFunction } from '../../Services/MulterLocal.js'
import { allowedExtensions } from "../../utlis/AllowedExtensions.js";
const router = Router()

//SignUp
router.post('/SignUp', asyncHandler(AuthControllers.SignUp))

//ConfirmEmail
router.patch('/confirm/:Token', asyncHandler(AuthControllers.ConfirmEmail))

//signin
router.post('/SignIn', asyncHandler(AuthControllers.SignIn))

//Update(email,phone)
router.put('/Update', isAuth(), asyncHandler(AuthControllers.Update))

//update Password
router.patch('/UpdatePassword', isAuth(), asyncHandler(AuthControllers.UpdatePassword))

//Get profile data
router.get('/GetProfile', isAuth(), asyncHandler(AuthControllers.GetProfile))

//soft delete
router.patch('/SoftDelete', isAuth(), asyncHandler(AuthControllers.SoftDelete))

//Forget Password

router.patch('/ForgetPassword',asyncHandler(AuthControllers.ForgetPassword))

//Reset Password
router.patch('/reset/:Token',asyncHandler(AuthControllers.resetPass))

//SignOut
router.patch('/SignOut',isAuth(),asyncHandler(AuthControllers.Signout))


//Add Profile pictureLocally
router.post('/AddProfilePicLocally', multerFunction(allowedExtensions.Image, 'User/Profile').single('profile'), asyncHandler(AuthControllers.AddProfilePictureLocally))

//Add Cover PictureLocally
router.post('/coverLocally',isAuth(),multerFunction(allowedExtensions.Image, 'User/Covers').fields([
        { name: 'cover', maxCount: 1 },
        { name: 'image', maxCount: 2 },
    ]),
    asyncHandler(AuthControllers.coverPictures),
)


export default router