import { model,Schema, SchemaType } from "mongoose";

const BookSchema = new Schema({
    Language:String,
    BookEdition:String,
    NumberOfPages:Number,
    Description:{
        type:String,
        minlength:[5,'too Short'],
        maxlength:[55],
        
    },
    Name:{
        type:String,
        required:true,
    },
    published_Date:Date,
    AuthorId:{
        type:Schema.Types.ObjectId,
        ref:'Author'
    },
    BookState:[{
        Average_Rating:Number,
        To_Read:Number,
        Number_reviews:Number,
        Currently_reading:Number,
        Read:Number,
            }],
        GenreID:{
        type:Schema.Types.ObjectId,
        ref:'Genre',
        // required:true,

        },
        Images: [
            {
            secure_url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
            },
        ],
        
        price:{
            type:Number,
            required:true,
            default:1,
        },
        AppliedDiscount:{
            type:Number,
            default:0,
        },
        PriceAfterDiscount:{
            type:Number,
            default:0,
        },
        stock:{
            type:Number,
            default:0,
            required:true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true, 
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

})
export const BookModel = model('Book',BookSchema)