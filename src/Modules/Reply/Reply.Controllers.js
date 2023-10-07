import { CommentModel } from "../../../DB/Models/Comments.Model.js"
import { ReplyModel } from "../../../DB/Models/Reply.Model.js"
import { BookModel } from "../../../DB/Models/Books.Model.js"
import { UserModel } from "../../../DB/Models/User.Model.js"




//Add Reply 
export const AddReply = async (req, res, next) => {
    const UserId = req.authUser._id
    const { CommentId, BookId } = req.query
    const { ReplyBody } = req.body


    const User = await UserModel.findById({ _id: UserId, IsDeleted: false })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const Book = await BookModel.findOne({ _id: BookId, IsDeleted: false })
    if (!Book) {
        return next(new Error('Book doesn\'t exist', { cause: 400 }))
    }
    const IsValidComment = await CommentModel.findOne({ _id: CommentId, isDeleted: false })
    if (!IsValidComment) {
        return next(new Error('Comment doesn\'t exist', { cause: 400 }))
    }
    const ReplYoBJ = new ReplyModel({
        CommentId,
        ReplyBody,
        UserId,
        BookId
    })
    const Reply = await ReplYoBJ.save()
    res.status(201).json({ Message: 'done', Reply });
}

// Delete Reply 
export const DeleteReply = async (req, res, next) => {
    const UserId = req.authUser._id
    const { ReplyId } = req.query

    const isexist = await ReplyModel.findOneAndDelete({_id:ReplyId,UserId:UserId})
    if (!isexist) {
        return next(new Error('reply doesn\'t exist', { cause: 400 }))
    }
    res.status(201).json({ Message: 'Deleted' });
}

//UpdateComment
export const UpdateReply = async (req, res, next) => {
    const UserId = req.authUser._id
    const { CommentId, BookId,ReplyId } = req.query
    const { ReplyBody } = req.body


    const User = await UserModel.findById({ _id: UserId, IsDeleted: false })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const Book = await BookModel.findOne({ _id: BookId, IsDeleted: false })
    if (!Book) {
        return next(new Error('Book doesn\'t exist', { cause: 400 }))
    }
    const IsValidComment = await CommentModel.findOne({ _id: CommentId, isDeleted: false })
    if (!IsValidComment) {
        return next(new Error('Comment doesn\'t exist', { cause: 400 }))
    }
    const isexist = await ReplyModel.findByIdAndUpdate({_id:ReplyId,UserId:UserId},{ReplyBody

    })
    if (!isexist) {
        return next(new Error('reply doesn\'t exist', { cause: 400 }))
    }

    res.status(201).json({ Message: 'Updated' });
}