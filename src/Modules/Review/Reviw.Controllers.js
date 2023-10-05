
import { ReviewModel } from "../../../DB/Models/Review.Model.js"
import {BookModel  } from "../../../DB/Models/Books.Model.js"
import { UserModel } from "../../../DB/Models/User.Model.js"
import {SystemRoles}from'../../utlis/SystemRoles.js'
import { nanoid } from "nanoid"


export const AddReview = async (req,res,next)=>{
const UserId=req.authUser._id
const{BookId}=req.query
const {ReviewRate}= req.body
const User = await UserModel.findById({ _id: UserId, IsDeleted: false })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
//check Book
const IsvalidBook = await UserModel.findOne({_id: UserId,
    'BookShelf.BookId':BookId,
    'BookShelf.status':SystemRoles.Read
})
if(!IsvalidBook){
    return next(new Error('You Should Read the Book First ',{cause:400}))
}


const existingReview = await ReviewModel.findOne({
    BookId: BookId,
    UserId: UserId
});

if (existingReview) {
    return next(new Error('You have already submitted a review for this book', { cause: 400 }));
}
const updatedReview = await ReviewModel.findOneAndUpdate(
    { BookId },
    { $inc: { Number_reviews: 1 } },
    { new: true }
);

if (!updatedReview) {
    return next(new Error('Failed to increment Number_reviews', { status: 400 }));
}


const ReviewObject=new ReviewModel({
    ReviewRate,
    UserId,
    BookId,
    Number_reviews:Number_reviews,
    
})
const ReviewDb= await ReviewObject.save()
if(!ReviewDb)
{
    return next(new Error('Failed to Add Review',{cause:400}))
}
const Book =await BookModel.findById(BookId)
const Reviews = await ReviewModel.find({ BookId });

let sumOfRates = 0;

for (const review of Reviews) {
    sumOfRates += review.ReviewRate;
}

const averageRating = Reviews.length > 0 ? sumOfRates / Reviews.length : 0;

// Update book's average rating in BookState
Book.BookState.Average_Rating = averageRating;
Book.BookState.Number_reviews=Number_reviews

// Save the updated book
const updatedBook = await Book.save();

res.status(201).json({ Message: 'done', book: updatedBook });
}


//overall rate = sum rate/num of rates