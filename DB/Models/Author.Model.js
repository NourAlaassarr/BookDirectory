import { Schema, SchemaTypes, model } from "mongoose"



const AuthorSchema = new Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    },
    Age: Number,
    Nationality: {
        type: String,
    },
    Gender:{
        type:String,
        lowercase:true,
        enum:['female','male','not specified'],
        default:'not specified',
        },
    Pic: {
        public_id: String,
        secure_url: String
    },
    CustomId: String,

}, { timestamps: true ,
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
})

AuthorSchema.virtual('Books',{
    foreignField:'AuthorId',
    localField:'_id',
    ref:'Book'
})


export const AuthorModel = model('Author', AuthorSchema)


