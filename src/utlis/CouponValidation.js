import { CouponModel } from "../../DB/Models/Coupon.Model.js"
import { SystemRoles } from "./SystemRoles.js"
import moment from 'moment-timezone';




export const IsCouponValid= async({CouponCode,UserId,next})=>{
const Coupon = await CouponModel.findOne({CouponCode})
if(!CouponCode){
    return next(new Error('Please enter a Valid coupoun Code',{cause:400}))
}
//Expiration
if(Coupon.CouponStatus==SystemRoles.Expired || moment(Coupon.ToDate).isBefore(moment().tz('Africa/Cairo'))){
    return next(new Error('Coupon is Expired',{cause:400}))
}

for(const User of Coupon.couponAssginedToUsers){
    if(UserId.toString()!==User.userId.toString())
    {
        return next(new Error('Coupon is not assigned to you',{cause:400}))
    }
    //max usage
    if(User.maxUsage<User.usageCount){
        return next(new Error('Exceed the max usage for this coupon',{cause:400}))
    }
}

return true
}