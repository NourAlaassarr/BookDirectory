

import { UserModel } from '../../../DB/Models/User.Model.js'
import { AuthorModel } from '../../../DB/Models/Author.Model.js'
import cloudinary from '../../utlis/CloudinaryConfig.js'
import { nanoid } from 'nanoid'


//add Author
export const addAuthor = async (req, res, next) => {
    const { Name, Age, Nationality, Gender } = req.body
    const UserId = req.authUser._id
    const UserExist = await UserModel.findById({ _id: UserId })
    if (!UserExist) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const isExist = await AuthorModel.findOne({ Name })
    if (isExist) {
        return next(new Error('Author Already Exists', { cause: 400 }))
    }
    if (!req.file) {
        return next(new Error('please upload  Author picture'))
    }
    const CustomId = nanoid()
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/Author/Picture/${CustomId}`,
        resource_type: 'image'
    })

    const AuthorObject = new AuthorModel({
        Name,
        Age,
        Nationality,
        Gender,
        CustomId,
        Pic: { public_id, secure_url }
    })
    const NewAuthor = await AuthorObject.save()
    res.status(201).json({ Message: 'Author Added Successfully', })

}

//delete Author
export const DeleteAuthor = async (req, res, next) => {
    const UserId = req.authUser._id
    const { AuthorID } = req.query

    const UserExist = await UserModel.findById({ _id: UserId })
    if (!UserExist) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const isExist = await AuthorModel.findById({ _id: AuthorID })
    if (!isExist) {
        return next(new Error('Author doesn\'t exist  ', { cause: 400 }))
    }
    await cloudinary.api.delete_resources_by_prefix(`${process.env.PROJECT_FOLDER}/Author/Picture/${isExist.CustomId}`)
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Author/Picture/${isExist.CustomId}`)
    res.status(200).json({ message: 'Deleted' })
}

//Get Author with all his works details using virtuals
export const GetAll = async (req, res, next) => {
    const { AuthorID } = req.query
    const isExist = await AuthorModel.findById({ _id: AuthorID })
    if (!isExist) {
        return next(new Error('Author doesn\'t exist  ', { cause: 400 }))
    }
    const GetAlls = await AuthorModel.find().populate([{
        path: 'Books',

    }])
    res.status(200).json({ message: 'DONE', GetAlls })
}


//Update
export const Update = async (req, res, next) => {
    const UserId = req.authUser._id
    const { Name, Age, Nationality, Gender } = req.body
    const { AuthorID } = req.query

    const UserExist = await UserModel.findById({ _id: UserId })
    if (!UserExist) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const isExist = await AuthorModel.findById({ _id: AuthorID })
    if (!isExist) {
        return next(new Error('Author doesn\'t exist  ', { cause: 400 }))
    }
    if (req.file) {
        const cust=nanoid()
        await cloudinary.api.delete_resources_by_prefix(`${process.env.PROJECT_FOLDER}/Author/Picture/${isExist.CustomId}`)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Author/Picture/${isExist.CustomId}`)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.PROJECT_FOLDER}/Author/Picture/${cust}`,
            resource_type: 'image'
        })
        const Updated=await AuthorModel.findByIdAndUpdate({ _id: AuthorID },{
            Name,
            Age,
            Nationality,
            Gender,
            CustomId:cust,
            Pic: { public_id, secure_url }
    
            },{new:true})
    }
        const Updated=await AuthorModel.findByIdAndUpdate({ _id: AuthorID },{
        Name,
        Age,
        Nationality,
        Gender,
        })
    
    res.status(201).json({ Message: 'Author Successfully Updated'})


}