import { Schema, SchemaTypes, model } from "mongoose"



const AuthorSchema = new Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    },
    Age:Number,
    Nationality:{
        type: String,
    },
    CustomId: String,
    Books:[{
        BookId:{
            type:Schema.Types.ObjectId,
            ref:'Book'
        },
    }]


},{timestamps:true})
export const AuthorModel = model('Author', AuthorSchema)


