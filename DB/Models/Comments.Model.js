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
        required:true
    },
    BookId:{
        type:Schema.Types.ObjectId,
        ref:'Book',
        required:true
    },
    Replies:[{
        type:Schema.Types.ObjectId,
        ref:'Reply',

    }],
    Likes:[{
        type:Schema.Types.ObjectId,
        ref:'User',

    }],
    isDeleted:{type:Boolean,
        default:false
    },

    CustomId: String,


},{timestamps:true})
export const CommentModel = model('Comment', CommentSchema)