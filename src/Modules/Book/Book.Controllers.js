import { BookModel } from '../../../DB/Models/Books.Model.js'
import { UserModel } from '../../../DB/Models/User.Model.js'
import { AuthorModel } from '../../../DB/Models/Author.Model.js'
import {PaginationFunction}from'../../utlis/PaginationFunction.js'
import{ApiFeature}from'../../utlis/apiFeatures.js'
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

// GetAllBook and filtering sorting selecting 
export const GetAll = async (req, res, next) => {

    const APiFeatureInstance = new ApiFeature( BookModel.find({}),req.query).sort().filter().pagination().select()
    const Book = await APiFeatureInstance.mongooseQuery

    res.status(202).json({ Message: 'done ', Book })

}
export const GetByName=async (req, res, next) => {
    const{Name,page,size}=req.query
    const{limit,skip}= PaginationFunction({page,size})
    
    const books = await BookModel.find({
        $or:[
            {Name:{$regex:Name,$options:'i'}},
        ],
    }).limit(limit).skip(skip)
    res.status(202).json({ Message: 'done ', books })
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
// //GetAllBook 

// export const GetAll = async (req, res, next) => {
//     const Boosk = await BookModel.find().populate({
//         path: 'createdBy',
//         select: "UserName"
//     })

//     res.status(202).json({ Message: 'done ', Boosk })

// }

//find by Name




