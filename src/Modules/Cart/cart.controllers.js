import {CartModel} from '../../../DB/Models/Cart.Model.js'
import {UserModel} from '../../../DB/Models/User.Model.js'
import {BookModel} from '../../../DB/Models/Books.Model.js'



// Add to cart
export const Add = async(req,res,next)=>{
const {BookId,quantity} =req.body
const UserId=req.authUser._id
const User= await UserModel.findById({_id:UserId})
if(!User){
    return next(new Error('Invalid credentials', { cause: 400 }))
}

//Book check
const Bookexist = await BookModel.findOne({ BookId:_id,IsDeleted:false,stock:{$gte:quantity}})

if (!Bookexist) {
    return next(new Error('Invalid Book please check for quantity', { cause: 400 }))
}

const UserCart = await CartModel.findOne({UserId}).lean()
if(UserCart){
//Update quantity
let BookEx=false
for(const Book of UserCart.Books){
    if(BookId==Book.BookId){
        BookEx=true
        Book.quantity=quantity
    }
}

    //push New book
    if(!BookEx){
        UserCart.Books.push({BookId,quantity})
    }
    let subtotal=0
for(const Boo of UserCart.Books){
    const BookPrices = await BookModel.findById(Boo.BookId)
    subtotal+=(BookPrices.PriceAfterDiscount*Boo.quantity)||0
}
const Cartb=await CartModel.findByIdAndUpdate({UserId},{
    SubTotal:subtotal,
    Books:UserCart.Books
},{
    new:true
})
res.status(201).json({Message:'Done',Cartb})

}
const newCart=new CartModel({
    UserId,
    Books:[{
        BookId,
        quantity
    }],
    SubTotal:Bookexist.PriceAfterDiscount * quantity
})

const CartOB = await newCart.save()
res.status(201).json({Message:'Done',CartOB})

}


//Delete Book from Cart
export const DeletefromCart= async (req,res,next)=>{
const{CartId,BookId}=req.query
const UserId = req.authUser._id

const User= await UserModel.findById({_id:UserId})
if(!User){
    return next(new Error('Invalid credentials', { cause: 400 }))
}
const Bookexist = await BookModel.findOne({_id:UserId})
if (!Bookexist) {
    return next(new Error('Invalid Book please check for quantity', { cause: 400 }))
}
const UserCart= await CartModel.findOne({UserId,'Books.BookId':BookId})
if(!UserCart){
    return next(new Error('cannot found the product in your Cart', { cause: 400 }))
}
UserCart.Books.forEach((ele)=>{
    if(ele.BookId==BookId){
        UserCart.Books.splice(UserCart.Books.indexOf(ele),1)
    }
})
UserCart.save()
res.status(201).json({Message:'Done',UserCart})
}