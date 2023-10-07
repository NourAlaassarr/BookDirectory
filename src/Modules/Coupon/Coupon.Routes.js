import { Router } from "express";
import { isAuth } from "../../Middleware/auth.js";
import { SystemRoles } from "../../utlis/SystemRoles.js";
import { asyncHandler } from '../../utlis/ErrorHandling.js'
import { multerFunction } from '../../Services/MulterLocal.js'
import { allowedExtensions } from "../../utlis/AllowedExtensions.js";
import{multerCloudFunction}from'../../Services/MulterCloud.js'
import * as CouponControllers from'./Coupon.Controllers.js'
import {UserApi}from'./Coupoun.ApiEndpoints.js'
const router = Router()



//Add Coupon
router.post('/Add',isAuth(UserApi.Admin),asyncHandler(CouponControllers.Add))

// Delete Coupon 
router.delete('/delete',isAuth(UserApi.Admin),asyncHandler(CouponControllers.DeleteCoupon))
//Update Coupon
router.put('/Update',isAuth(UserApi.Admin),asyncHandler(CouponControllers.UpdateCoupon))

//GetALLCoupons
router.get('/GetAll',isAuth(UserApi.Admin),asyncHandler(CouponControllers.GetAll))


export default router
