import { Router } from "express";
import { isAuth } from "../../Middleware/auth.js";
import * as AuthControllers from './Auth.Controllers.js'
import { SystemRoles } from "../../utlis/SystemRoles.js";
import { asyncHandler } from '../../utlis/ErrorHandling.js'
import { multerFunction } from '../../Services/MulterLocal.js'
import { allowedExtensions } from "../../utlis/AllowedExtensions.js";
import{multerCloudFunction}from'../../Services/MulterCloud.js'
import {UserApi}from'./Auth.Endpoints.js'
const router = Router()

//SignUp
router.post('/SignUp', asyncHandler(AuthControllers.SignUp))

//ConfirmEmail
router.patch('/confirm/:Token', asyncHandler(AuthControllers.ConfirmEmail))

//signin
router.post('/SignIn', asyncHandler(AuthControllers.SignIn))

//Update(email,phone)
router.put('/Update', isAuth(UserApi.User_api), asyncHandler(AuthControllers.Update))

//update Password
router.patch('/UpdatePassword', isAuth(UserApi.User_api), asyncHandler(AuthControllers.UpdatePassword))

//Get profile data
router.get('/GetProfile', isAuth(UserApi.User_api), asyncHandler(AuthControllers.GetProfile))

//soft delete
router.patch('/SoftDelete', isAuth(UserApi.User_api), asyncHandler(AuthControllers.SoftDelete))

//Forget Password

router.patch('/ForgetPassword',asyncHandler(AuthControllers.ForgetPassword))

//Reset Password
router.patch('/reset/:Token',asyncHandler(AuthControllers.resetPass))

//DeleteUser
router.delete('/delete',isAuth(UserApi.User_api),asyncHandler(AuthControllers.deleteuser))

//SignOut
router.patch('/SignOut',isAuth(UserApi.User_api),asyncHandler(AuthControllers.Signout))

//ProfilePic cloud
router.post('/AddProfilePic',isAuth(UserApi.User_api),multerCloudFunction(allowedExtensions.Image).single('profile'),asyncHandler(AuthControllers.AddProfilePicture))

//Cloud cover
// router.post(
//     '/cover',
//     isAuth(),
//     multerCloudFunction(allowedExtensions.Image, 'User/Covers').fields([
//     { name: 'cover', maxCount: 1 },
//     { name: 'image', maxCount: 2 },
//     ]),
//     asyncHandler(AuthControllers.coverPictures),
// )

//Add Profile pictureLocally
router.post('/AddProfilePicLocally', isAuth(UserApi.User_api),multerFunction(allowedExtensions.Image, 'User/Profile').single('profile'), asyncHandler(AuthControllers.AddProfilePictureLocally))

//Add Cover PictureLocally
// router.post('/coverLocally',isAuth(UserApi.User_api),multerFunction(allowedExtensions.Image, 'User/Covers').fields([
//         { name: 'cover', maxCount: 1 },
//         { name: 'image', maxCount: 2 },
//     ]),
//     asyncHandler(AuthControllers.coverPictures),
// )


export default router