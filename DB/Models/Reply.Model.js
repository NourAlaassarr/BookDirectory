

import{model,Schema}from'mongoose'

const ReplySchema = new Schema({
    ReplyBody: {
        type: String,
        required: true,
        unique: true
    },
    UserId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    BookId:{
        type:Schema.Types.ObjectId,
        ref:'Book',
        required:true
    },
    CommentId:{
        type:Schema.Types.ObjectId,
        ref:'Comment',
        required:true
    },
    Replies:[{
        type:Schema.Types.ObjectId,
        ref:'Reply',

    }],
    isDeleted:{type:Boolean,
        default:false
    },

    CustomId: String,


})
export const ReplyModel = model('Reply', ReplySchema)