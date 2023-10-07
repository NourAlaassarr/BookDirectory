import {model ,Schema}from'mongoose'
import { SystemRoles } from '../../src/utlis/SystemRoles.js'

const CouponSchema=new Schema({
    CouponCode:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    fromDate:{
        type:String,
        required:true
    },
    ToDate:{
        type:String,
        required:true,
    },
    CouponStatus:{
        type:String,
        required:true,
        enum:[SystemRoles.Expired,SystemRoles.Valid],
        default:SystemRoles.Valid,
    },
    couponAssginedToUsers: [
        {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required:true
        },
        maxUsage: {
            type: Number,
            required: true,
            default: 1,
        },
        usageCount:{
            type:Number,
            default:0,
        }
        },
    ],
    couponAmount:{
        type:Number,
        required:true,
        min:1,
        max:100,
        default:1,
    },
    isPercentage:{
    type: Boolean,
    required: true,
    default: false,
    },
    isFixedAmount: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

},{
    timestamps:true
})
export const CouponModel= model('Coupon',CouponSchema)