import { model, Schema } from 'mongoose'

const ReviewSchema = new Schema({
    UserId: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    BookId: {
        type: Schema.ObjectId,
        ref: 'Book',
        required: true,
    },
    ReviewRate: {
        type: Number,
        default: 0,
        require: true,
        min: 1,
        max: 5,
        enum: [1, 2, 3, 4, 5]
    },
    Number_reviews:Number

}, {
    timestamps: true,
})

export const ReviewModel = model('Review', ReviewSchema)