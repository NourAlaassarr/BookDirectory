import {BookModel} from '../../../DB/Models/Books.Model.js'
import { UserModel } from '../../../DB/Models/User.Model.js'


//Add Book 
export const Add_Book=async(req,res,next)=>{
    const UserId =req.authUser._id
    const {Name,
        Language,
        BookEdition,
        NumberOfPages,
        Description,
        price,
        AppliedDiscount,
        PriceAfterDiscount,
        stock}=req.body
    const User= await UserModel.findOne({_id:UserId})
    if(!User){
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const Bookexist=await BookModel.findOne({Name})

    if(Bookexist){
        return next(new Error('Book is Already Exsit', { cause: 400 }))
    }
    const bookObject = new BookModel({
        Name,Language,BookEdition,NumberOfPages,Description,price,AppliedDiscount,PriceAfterDiscount,stock,
        createdBy:User._id
    })
    const bookfinal=await bookObject.save()
    res.status(202).json({ Message: 'successfully Added', bookfinal })

}

//Delete Book
export const DeleteBook=async(req,res,next)=>{
    const UserId =req.authUser._id
    const{BookId}=req.query
    const User= await UserModel.findOne({_id:UserId})
    if(!User){
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const Bookexist=await BookModel.findOneAndDelete({_id:BookId,createdBy:UserId})
    if(!Bookexist){
        return next(new Error('Book doesn\'t exist', { cause: 400 }))
    }
    res.status(202).json({ Message: 'Successfully Delete', Bookexist})

}

<<<<<<< HEAD
//GetAllBook

export const GetAll=async(req,res,next)=>{
    const Boosk=await BookModel.find().populate({
        path:'createdBy',
        select:"UserName"
        })

    res.status(202).json({ Message: 'done ', Boosk })

}

=======
>>>>>>> main
