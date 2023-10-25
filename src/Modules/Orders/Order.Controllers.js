import{UserModel}from'../../../DB/Models/User.Model.js'
import{CouponModel}from'../../../DB/Models/Coupon.Model.js'
import{OrderModel}from'../../../DB/Models/Order.Model.js'
import{BookModel}from'../../../DB/Models/Books.Model.js'
import { IsCouponValid } from '../../utlis/CouponValidation.js'


//Create Order
export const AddOrder=async(req,res,next)=>{
// const {}=req.query
const{
    Address,
    PaymentMethod,
    PhoneNumber,
    CouponCode,
    BookId,
    quantity,
}=req.body
const UserId=req.authUser._id

//checkUser
const User = await UserModel.findById({ _id: UserId, IsDeleted: false })
    if (!User)
    {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
//coupoun check
if(CouponCode){
    const Coupon = await CouponModel.findOne({CouponCode}).select('isPercentage isFixedAmount couponAmount couponAssginedToUsers')
    const CouponValid = await IsCouponValid({CouponCode,UserId,next})
    if(CouponValid!==true){
        return CouponValid
    }
    req.Coupon=Coupon

}

//Books
const Books =[]
const IsBookValid = await BookModel.findOne({_id:BookId,
stock:{$gte:quantity}})
if(!IsBookValid){
    return next(new Error('Invalid Book please check for your quantity', { cause: 400 }))
}

const BookObject = {
    BookId,
    quantity,
    BookName:IsBookValid.Name,
    price:IsBookValid.PriceAfterDiscount,
    finalPrice:IsBookValid.PriceAfterDiscount *quantity
}
Books.push(BookObject)

let subTotal = BookObject.finalPrice

//paid amount
let paidAmount=0
//CopounisPercentage
if(req.Coupon?.isPercentage)
{
    paidAmount=subTotal*(1-(req.Coupon.couponAmount || 0)/100)
}
//isFixedAmount
else if(req.Coupon?.isFixedAmount)
{
paidAmount=subTotal=req.Coupon.couponAmount
}
else{
    paidAmount=subTotal
}

let OrderStatus ;
PaymentMethod =='Cash'? (OrderStatus='placed'):(OrderStatus='Pending')
const OrderOb ={
    UserId,
    products:product,
    CouponCode,
    Address,
    PhoneNumber,
    PaymentMethod,
    paidAmount:paidAmount,
    subTotal:subTotal,
    OrderStatus,
    CouponId:req.Coupon?._id,

}
const OrderDB= await OrderModel.create(OrderOb)
res.status(201).json({Message:'Order Created Successfully'})
if(!OrderDB)
{
    return next(new Error('Fail to Create Order',{cause:400}))
}


//Payment

}