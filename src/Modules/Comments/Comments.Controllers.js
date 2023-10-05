import { CommentModel } from "../../../DB/Models/Comments.Model.js";
import { BookModel } from '../../../DB/Models/Books.Model.js'
import { UserModel } from '../../../DB/Models/User.Model.js'




//Add Comment
export const Add = async (req, res, next) => {
    const { CommentBody } = req.body
    const { BookId } = req.query
    const UserId = req.authUser._id
    const User = await UserModel.findById({ _id: UserId, IsDeleted: false })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }

    const BookExist = await BookModel.findById({ _id: BookId, IsDeleted: false })
    if (!BookExist) {
        return next(new Error('Book Doesn\'t Exist', { cause: 400 }))
    }
    const Commentobj = new CommentModel({
        CommentBody,
        BookId: BookId,
        CreatedBy: UserId,
    })
    const object = await Commentobj.save()
    res.status(200).json({ message: 'Comment Added', object })


}


//Update Comment

export const Update = async (req, res, next) => {
    const { CommentBody } = req.body
    const { CommentId, BookId } = req.query
    const UserId = req.authUser._id
    const User = await UserModel.findById({ _id: UserId, IsDeleted: false })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const BookExist = await BookModel.findOne({ _id: BookId, IsDeleted: false })
    if (!BookExist) {
        return next(new Error('Can\'t Update Comment on Deleted Book', { cause: 400 }))
    }
    const CommentExist = await CommentModel.findOneAndUpdate({ _id: CommentId, BookId: BookId, createdBy: UserId }, {
        CommentBody
    })
    if (!CommentExist) {
        return next(new Error('Comment Doesn\'t Exist', { cause: 400 }))
    }

    res.status(200).json({ message: 'Comment Updated', CommentExist })
}


//delete Comment
export const deleteComment = async (req, res, next) => {
    const { CommentId } = req.query
    const UserId = req.authUser._id
    const User = await UserModel.findById({ _id: UserId, IsDeleted: false })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const CommentExist = await CommentModel.findOneAndDelete({ _id: CommentId, CreatedBy: UserId }, {

    })
    if (!CommentExist) {
        return next(new Error('Comment Doesn\'t Exist', { cause: 400 }))
    }

    res.status(200).json({ message: 'Comment Deleted', CommentExist })
}


//Like Comment
export const AddLike = async (req, res, next) => {
    const UserId = req.authUser._id
    const { BookId, CommentId } = req.query
    const User = await UserModel.findById({ _id: UserId, IsDeleted: false })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const BookExist = await BookModel.findById({ _id: BookId, IsDeleted: false })
    if (!BookExist) {
        return next(new Error('Book Doesn\'t Exist', { cause: 400 }))
    }

    const CommentExist = await CommentModel.findOne({ _id: CommentId, BookId: BookId })
    if (!CommentExist) {
        return next(new Error('Comment Doesn\'t Exist', { cause: 400 }))
    }
    CommentExist.Likes.push(UserId)
    await CommentExist.save()
    res.status(200).json({ message: 'Liked Comment ', CommentExist })
}



//UnlikeComment
export const UnLike = async (req, res, next) => {
    const UserId = req.authUser._id
    const { BookId, CommentId } = req.query
    const User = await UserModel.findById({ _id: UserId, IsDeleted: false })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const BookExist = await BookModel.findById({ _id: BookId, IsDeleted: false })
    if (!BookExist) {
        return next(new Error('Book Doesn\'t Exist', { cause: 400 }))
    }

    const CommentExist = await CommentModel.findOne({ _id: CommentId, BookId: BookId })
    if (!CommentExist) {
        return next(new Error('Comment Doesn\'t Exist', { cause: 400 }))
    }

    const userLikeIndex = CommentExist.Likes.findIndex(likeUserId => likeUserId.toString() === UserId.toString());

    console.log(userLikeIndex)
    if (userLikeIndex !== -1) {
        // Remove the user's like from the Likes array
        CommentExist.Likes.splice(userLikeIndex, 1);
        await CommentExist.save();
        res.status(200).json({ message: 'Unliked Comment', CommentExist });
    }
    else {
        res.status(200).json({ message: 'User did not like this comment' });
    }
}

//Todo: Get Comment with replies