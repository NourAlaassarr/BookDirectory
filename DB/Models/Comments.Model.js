import { Schema, model } from "mongoose"




const CommentSchema = new Schema({
    CommentBody: {
        type: String,
        required: true,
        unique: true
    },
    CreatedBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    BookId:{
        type:Schema.Types.ObjectId,
        ref:'Book',
    },
    Replies:[{
        type:Schema.Types.ObjectId,
        ref:'Reply',

    }],
    Likes:[{
        type:Schema.Types.ObjectId,
        ref:'User',

    }],
    CustomId: String,


})
export const CommentModel = model('Comment', CommentSchema)