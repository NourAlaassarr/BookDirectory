import { Schema, model } from "mongoose"




const GenresSchema = new Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    },
    CustomId: String,



})
export const GenreModel = model('Genre', GenresSchema)
