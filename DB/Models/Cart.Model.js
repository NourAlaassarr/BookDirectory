import { Schema, model } from "mongoose";

const CartSchema = new Schema({
    UserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    Books: [{
        BookId: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        }
    }],
    SubTotal: {
        type: Number,
        required: true
    }

}, { timestamps: true })

export const CartModel = model('Cart', CartSchema)