import { CouponModel } from '../../../DB/Models/Coupon.Model.js'
import { UserModel } from '../../../DB/Models/User.Model.js'
import { SystemRoles } from '../../utlis/SystemRoles.js'

//Add
export const Add = async (req, res, next) => {
    const UserId = req.authUser._id
    const {
        isFixedAmount,
        isPercentage,
        couponAmount,
        couponAssginedToUsers,
        fromDate,
        ToDate,
        CouponCode } = req.body

    //check for coupoun
    const IscouponDuplicate = await CouponModel.findOne({ CouponCode })
    if (IscouponDuplicate) {
        return next(new Error('duplicate couponCode', { cause: 400 }))
    }
    //check for user
    const User = await UserModel.findById({ _id: UserId, IsDeleted: false })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    //OnlyAdmins Can Add
    if (User.role == SystemRoles.Admin) {

        //Add Coupoun
        if((!isPercentage && !isFixedAmount) || (isFixedAmount && isPercentage))
        {
            return next(
                new Error('select if the coupon is percentage or fixedAmount', {
                    cause: 400,
                }),
            )
        }
        let UsersId = []
        for (const user  of couponAssginedToUsers) {
            UsersId.push(user.userId)
        }
        const userCheck = await UserModel.findById({
            _id: {
                $in: UsersId,
            }
        })
        if (UsersId.length !== userCheck.length) {
            return next(new Error('invalid userIds', { cause: 400 }))
        }
        const couponObject = {
            isFixedAmount,
            isPercentage,
            couponAmount,
            couponAssginedToUsers,
            fromDate,
            ToDate,
            CouponCode,
            createdBy: req.authUser._id
        }
        const couponDb = await CouponModel.create(couponObject)
        if (!couponDb) {
            return next(new Error('Failed to Add Coupon', { cause: 400 }))
        }
        res.status(201).json({ message: 'Done', couponDb })
    }
    return next(new Error('You Are Not Authorized', { cause: 400 }))
}

//Delete(admin or owner)
export const DeleteCoupon = async (req, res, next) => {
    const UserId = req.authUser._id
    const { CouponId } = req.query

    //user Check
    const User = await UserModel.findById({ _id: UserId, IsDeleted: false })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    //coupon check
    const Check = await CouponModel.findById({ _id: CouponId })

    if (!Check) {
        return next(new Error('Invalid Coupon', { cause: 400 }))
    }
    if (User.role == SystemRoles.Admin || UserId.toString() == Check.createdBy.toString()) {
        const CouponDeletion = await CouponModel.findByIdAndDelete({ _id: CouponId })
        res.status(200).json({Message:"Successfully Deleted!"})
    }
    return next(new Error('You Are Not Authorized', { cause: 400 }))

}

//Update(admin or owner)
export const UpdateCoupon=async (req,res,next)=>{
    const{CouponId}=req.query
    const UserId=req.authUser._id
const {
    couponAmount,
    couponAssginedToUsers,
    fromDate,
    ToDate,
    CouponCode,}=req.body
    const User = await UserModel.findById({ _id: UserId, IsDeleted: false })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }

    const Check = await CouponModel.findById({ _id: CouponId })
    if(!Check){
        return next(new Error('Invalid Coupon', { cause: 400 }))
    }

    //Update
    if(User.role==SystemRoles.Admin || Check.createdBy.toString()==UserId.toString()){
        //check for To date
        if(ToDate<Date.now()){
            return next(new Error('Expired', { cause: 400 }))
        }
        //Assigned to
        let UsersId = []
        for (const user  of couponAssginedToUsers) {
            UsersId.push(user.userId)
        }
        const userCheck = await UserModel.findById({
            _id: {
                $in: UsersId,
            }
        })
        if (UsersId.length !== userCheck.length) {
            return next(new Error('invalid userIds', { cause: 400 }))
        }

        const Updated = await CouponModel.findByIdAndUpdate(CouponId, {
            $push: { couponAssginedToUsers: { $each: UsersId } },
            CouponCode,
            couponAmount,
            fromDate,
            ToDate
        });

        return res.status(200).json({ message: 'Coupon Successfully Updated ', Updated});

    }
return next(new Error('You Are Not Authorized', { cause: 400 }))
}

//getAll(AdminsOnly)
export const GetAll = async (req, res, next) => {
    const UserId = req.authUser._id
    const { CouponId } = req.query

    //user Check
    const User = await UserModel.findById({ _id: UserId, IsDeleted: false })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    if (User.role == SystemRoles.Admin) {
        const Check = await CouponModel.find()
        res.status(200).json({Message:"Done",Coupons:Check})
    }
    return next(new Error('You Are Not Authorized', { cause: 400 }))
}