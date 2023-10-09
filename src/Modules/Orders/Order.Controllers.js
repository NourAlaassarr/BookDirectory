
import{UserModel}from'../../../DB/Models/User.Model.js'
import{CouponModel}from'../../../DB/Models/Coupon.Model.js'
import{OrderModel}from'../../../DB/Models/Order.Model.js'
import{BookModel}from'../../../DB/Models/Books.Model.js'









//Create Order
export const AddOrder=async(req,res,next)=>{
// const {}=req.query
const{
    Address,
    PaymentMethod,
    PhoneNumber,
    CouponId,BookId,
    quantity,
}=req.body
const UserId=req.authUser._id 
//checkUser
const User = await UserModel.findById({ _id: UserId, IsDeleted: false })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    //check coupon
    if(CouponId){
        const Coupon= await CouponModel.findOne({CouponId}).select('isPercentage isFixedAmount couponAmount couponAssginedToUsers')
    }


}