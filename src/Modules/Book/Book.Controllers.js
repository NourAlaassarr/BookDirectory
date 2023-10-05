import { BookModel } from '../../../DB/Models/Books.Model.js'
import { UserModel } from '../../../DB/Models/User.Model.js'
import { AuthorModel } from '../../../DB/Models/Author.Model.js'

//Add Book 
export const Add_Book = async (req, res, next) => {
    const UserId = req.authUser._id
    const { AuthorId } = req.query
    const { Name,
        Language,
        BookEdition,
        NumberOfPages,
        Description,
        price,
        AppliedDiscount,
        PriceAfterDiscount,
        stock } = req.body
    

    const author = await AuthorModel.findById({ _id: AuthorId })
    if (!author) {
        return next(new Error('Author doesn\'t exists', { cause: 400 }))
    }

const User = await UserModel.findById({_id:UserId})
if (!User) {
    return next(new Error('Invalid credentials', { cause: 400 }))
}
const Bookexist = await BookModel.findOne({ Name })

if (Bookexist) {
    return next(new Error('Book is Already Exsit', { cause: 400 }))
}
const bookObject = new BookModel({
    Name, Language, BookEdition, NumberOfPages, Description, price, AppliedDiscount, PriceAfterDiscount, stock,
    createdBy: User._id,AuthorId,
})
const bookfinal = await bookObject.save()
res.status(202).json({ Message: 'successfully Added', bookfinal })

}

//Delete Book
export const DeleteBook = async (req, res, next) => {
    const UserId = req.authUser._id
    const { BookId } = req.query
    const User = await UserModel.findOne({ _id: UserId })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const Bookexist = await BookModel.findOne({ _id: BookId, createdBy: UserId })
    if (!Bookexist) {
        return next(new Error('Book doesn\'t exist', { cause: 400 }))
    }
    Bookexist.IsDeleted = true
    Bookexist.save()
    res.status(202).json({ Message: 'Successfully Delete', Bookexist })

}

//GetAllBook TODO:pagination

export const GetAll = async (req, res, next) => {
    const Boosk = await BookModel.find().populate({
        path: 'createdBy',
        select: "UserName"
    })

    res.status(202).json({ Message: 'done ', Boosk })

}

//get book with comments and replies 
export const GetAllWithComments = async (req, res, next) => {
    const { BookId } = req.query
    const Bookexist = await BookModel.findOne({ _id: BookId })
    if (!Bookexist) {
        return next(new Error('Book doesn\'t exist', { cause: 400 }))
    }
    const Book = await BookModel.find().populate({
        path: 'GetComments',
    })

    res.status(202).json({ Message: 'done ', Book })

}