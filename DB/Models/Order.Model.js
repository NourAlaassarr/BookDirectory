import { Schema, model } from 'mongoose'


const OrderSchema = new Schema({
    UserId: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    PhoneNumber: [{
        type: String,
        required: true,
    }],

    Books: [{
        BookId: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
        BookName: {
            type: String,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        price: {
            type: Number,
            required: true,

        },
        finalPrice: {
            type: Number,
            required: true,
        },
    }],
    Address: {
        type: String,
        required: true,
    },
    CouponId: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon',
    },
    subTotal: {
        type: Number,
        required: true,
        default: 0,
    },
    paidAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    PaymentMethod: {
        type: String,
        required: true,
        enum: ['Cash', 'Card']
    },
    UpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    CanceledBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reason: String,
    OrderStatus: {
        type: String,
        enum: ['Delivered', 'Pending', 'Confirmed', 'placed', 'Preparation', 'canceled', 'on way'],
    },
}, { timeseries: true })
export const OrderModel = model('Order', OrderSchema) 