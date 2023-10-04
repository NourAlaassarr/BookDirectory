import { UserModel } from '../../../DB/Models/User.Model.js'
import { GenerateToken, VerifyToken } from '../../utlis/TokenFunction.js'
import pkg from 'bcrypt'
import { sendmailService } from '../../Services/SendEmailService.js'
import { emailTemplate } from '../../utlis/EmailTemplate.js'
import { nanoid } from 'nanoid'
import { SystemRoles } from '../../utlis/SystemRoles.js'
import cloudinary from '../../utlis/CloudinaryConfig.js'
import { BookModel } from '../../../DB/Models/Books.Model.js'
//SignUp
export const SignUp = async (req, res, next) => {
    const { Email, Password, ConfirmPassword, Gender, Address, Phone, UserName, FirstName, LastName, role } = req.body

    //check for duplication UserName/email
    const EmailCheck = await UserModel.findOne({ Emai: Email })
    if (EmailCheck) {
        return next(new Error('Email is Already Exsit', { cause: 400 }))
    }
    const Check = await UserModel.findOne({ UserName: UserName })
    if (Check) {
        return next(new Error('UserName is Already Exsit', { cause: 400 }))
    }
    //-----------------------------------------------------------------------------
    if (Password !== ConfirmPassword) {
        return next(new Error('Password Does\'t Match', { cause: 400 }))
    }
    //HashPassword 
    // const HashPassword= pkg.hashSync(PassWord,8)
    //Using HOOKS

    //------------------Confirm Email Token------------------------------------------------
    const Token = GenerateToken({
        payload: { Email },
        signature: process.env.SIGNATURE_CONFIRMATION_EMAIL,
        expiresIn: '1d'
    })
    const ConfirmationLink = `${req.protocol}://${req.headers.host}/Auth/confirm/${Token}`
    const IsEmailSend = sendmailService({
        to: Email,
        subject: 'Confirmation Email',
        Message: emailTemplate({
            link: ConfirmationLink,
            linkData: 'Click here to Confirm',
            subject: 'Confirmation Email'
        })
    })
    if (!IsEmailSend) {
        return next(new Error('Failed to send Confirmation Email', { cause: 400 }))
    }



    const UserObject = new UserModel({
        Email,
        Password,
        ConfirmPassword,
        Gender,
        Address,
        Phone,
        UserName,
        role


    })
    const User = await UserObject.save()
    res.status(202).json({ Message: 'Sign-Up Successfully', User })
}

//Confirm Email
export const ConfirmEmail = async (req, res, next) => {
    const { Token } = req.params
    const DecodedData = VerifyToken({ token: Token, signature: process.env.SIGNATURE_CONFIRMATION_EMAIL })
    const CheckUser = await UserModel.findOneAndUpdate({ Email: DecodedData?.Email, IsConfirmed: false }, {
        IsConfirmed: true

    }, {
        new: true
    })
    if (!CheckUser) {
        return next(new Error('Already Confirmed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Successfully Confirmed,Try to log in' })
}

//Sign in
export const SignIn = async (req, res, next) => {
    const { Email, Password } = req.body

    const Usercheck = await UserModel.findOne({ Email })
    if (!Usercheck) {
        return next(new Error('Invalid Credentials', { cause: 400 }))
    }
    const IsPasswordMatch = pkg.compareSync(Password, Usercheck.Password)
    if (!IsPasswordMatch) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const Token = GenerateToken({
        payload: {
            Email: Usercheck.Email,
            _id: Usercheck._id,
        },
        signature: process.env.SIGN_IN_TOKEN_SECRET,
        expiresIn: '1d'
    })
    const UserUpdate = await UserModel.findOneAndUpdate({ Email }, {
        token: Token,
        isDeleted: false,
        Userstatus: SystemRoles.Online,
    }, {
        new: true
    })
    res.status(200).json({ Message: "Successfully Logged IN", UserUpdate })

}

//SignOut
export const Signout = async (req, res, next) => {
    const UserId = req.authUser._id
    const User = await UserModel.findById({ _id: UserId })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const softDelete = await UserModel.findByIdAndUpdate({ _id: UserId }, { Userstatus: SystemRoles.Offline })
    res.status(200).json({ Message: "Profile Successfully soft Deleted" })



}
//UpdateProfile(Email,Phone)
export const Update = async (req, res, next) => {
    const { Phone, Email } = req.body
    const UserId = req.authUser._id
    const Ifexist = await UserModel.findById({ _id: UserId })
    if (!Ifexist) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const checkPhone = await UserModel.findOne({ Phone: Phone })
    if (checkPhone) {
        return next(new Error('Phone Number Already Exist, Please Choose Another Phone Number', { cause: 400 }))
    }
    //------------------Confirm Email Token------------------------------------------------
    if (req.body.Email) {

        const CheckEmail = await UserModel.findOne({ Email: Email })
        if (CheckEmail) {
            return next(new Error('Email ALready exist', { cause: 400 }))
        }

        const Token = GenerateToken({
            payload: { Email },
            signature: process.env.SIGNATURE_CONFIRMATION_EMAIL,
            expiresIn: '1d'
        })
        const ConfirmationLink = `${req.protocol}://${req.headers.host}/Auth/confirm/${Token}`
        const IsEmailSend = sendmailService({
            to: Email,
            subject: 'Confirmation Email',
            Message: emailTemplate({
                link: ConfirmationLink,
                linkData: 'Click here to Confirm',
                subject: 'Confirmation Email'
            })
        })
        if (!IsEmailSend) {
            return next(new Error('Failed to send Confirmation Email', { cause: 400 }))
        }
        await UserModel.findByIdAndUpdate({ _id: UserId }, { IsConfirmed: false })
    }

    const toBeUpdated = await UserModel.findByIdAndUpdate({ _id: UserId }, { ...(Email && { Email }), ...(Phone && { Phone }) }, { new: true })
    res.status(200).json({ Message: "Updated Successfully", toBeUpdated })

}

//Update(Password)
export const UpdatePassword = async (req, res, next) => {
    const UserId = req.authUser._id
    const { OldPassword, NewPassword, ConfirmNewPassword } = req.body

    const User = await UserModel.findById({ _id: UserId })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const PassCheck = pkg.compareSync(OldPassword, User.Password)
    if (!PassCheck) {
        return next(new Error('Invalid Password', { cause: 400 }))
    }
    if (OldPassword == NewPassword) {
        return next(new Error('Please choose a new password', { cause: 400 }))
    }
    if (NewPassword != ConfirmNewPassword) {
        return next(new Error('Password doesn\'t match', { cause: 400 }))
    }

    const HashPass = pkg.hashSync(NewPassword, +process.env.SALT_ROUNDS)

    const updatedPass = await UserModel.findOneAndUpdate({ _id: UserId },
        {
            Password: HashPass,
            Cpassword: HashPass,
            ChangePassAt: new Date()
        }, {
        new: true
    })

    // User.Password=NewPassword
    // User.ConfirmPassword=ConfirmNewPassword
    // User.save()
    res.status(200).json({ Message: "Password successfully Changed" })
}

//Get user profile
export const GetProfile = async (req, res, next) => {
    const UserId = req.authUser._id
    const User = await UserModel.findById({ _id: UserId })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }

    const UserData = await UserModel.findById({ _id: UserId })
    res.status(200).json({ Message: "Done", UserData })

}

//SoftDelete Profile
export const SoftDelete = async (req, res, next) => {
    const UserId = req.authUser._id
    const User = await UserModel.findById({ _id: UserId })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const softDelete = await UserModel.findByIdAndUpdate({ _id: UserId }, { isDeleted: true })
    res.status(200).json({ Message: "Profile Successfully soft Deleted" })

}

//ForgetPass
export const ForgetPassword = async (req, res, next) => {
    const { Email } = req.body
    //Check if User Exists
    const User = await UserModel.findOne({ Email })
    if (!User) {
        return next(new Error('Invalid Email', { cause: 400 }))
    }
    const Code = nanoid()
    const hashedCode = pkg.hashSync(Code, +process.env.SALT_ROUNDS)

    //----------------generate Token--------------------
    const Token = GenerateToken({
        payload: {
            Email: Email,
            _id: User._id,
            Code: hashedCode,
        },
        signature: process.env.SIGNATURE_PASSWORD_RESET,
        expiresIn: '2m'
    })
    //-----------------Send Reset Email------------------------------
    const ResetLink = `${req.protocol}://${req.headers.host}/Auth/reset/${Token}`
    const sendEmail = sendmailService({
        to: Email,
        subject: 'Reset Password',
        Message: emailTemplate({
            link: ResetLink,
            linkData: 'Click here to Reset Password',
            subject: 'Password Reset'
        })
    })
    if (!sendEmail) {
        return next(new Error('Failed to send Reset Password Email', { cause: 400 }))
    }
    const UserUpdate = await UserModel.findOneAndUpdate({ Email, },
        {
            Code: hashedCode
        }, {
        new: true
    })
    res.status(200).json({ Message: 'Done', UserUpdate, ResetLink })
}

//Reset Password
export const resetPass = async (req, res, next) => {
    const { Token } = req.params
    const { NewPassword } = req.body
    const DecodedData = VerifyToken({
        token: Token,
        signature: process.env.SIGNATURE_PASSWORD_RESET
    })
    const User = await UserModel.findOne({
        Email: DecodedData?.Email,
        Code: DecodedData?.Code
    })
    if (!User) {
        return next(new Error('you already rest your password, try to login', { cause: 400 }))
    }
    User.Password = NewPassword
    User.Code = null
    User.ChangePassAt = Date.now()
    const ResetPassword = await User.save()
    res.status(200).json({ Message: 'Done', ResetPassword })
}

//AddProfilePicture cloud
export const AddProfilePicture = async (req, res, next) => {
    const UserId = req.authUser._id
    const UserExist = await UserModel.findById({ _id: UserId })
    if (!UserExist) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    if (!req.file) {
        return next(new Error('please upload your profile picture'))
    }
    const CustomId = nanoid()
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/Users/Profiles/${CustomId}`,
        resource_type: 'image'
    })

    const User = await UserModel.findByIdAndUpdate({ _id: UserId }, { ProfilePic: { public_id, secure_url }, CustomId: CustomId }, { new: true })
    if (!User) {
        await cloudinary.uploader.destroy(public_id)
    }
    res.status(200).json({ message: 'done', User })
}
//Add to BookShelf
export const AddToBookShelf = async (req, res, next) => {
    const UserId = req.authUser._id
    const { BookId } = req.query
    const { status } = req.body
    const UserExist = await UserModel.findById({ _id: UserId })
    if (!UserExist) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const BookExist = await BookModel.findOne({ _id: BookId, IsDeleted: false })
    if (!BookExist) {
        return next(new Error('doesn\'t exist', { cause: 400 }))
    }

    const bookInShelf = UserExist.BookShelf.find(item => item.BookId.toString() === BookId.toString());

    if (bookInShelf) {
        next(new Error('Book already in BookShelf', { cause: 400 }))
    }
    // Add the book to the BookShelf
    const updatedUser = await UserModel.findOneAndUpdate(
        { _id: UserId },
        { $push: { BookShelf: { BookId, status } } },
        { new: true }  
    );
    
    // UserExist.BookShelf.push({ BookId, status });
    // await UserExist.save();

    res.status(200).json({ Message: 'Added to Shelf', updatedUser });
}

//AddCoverPicture cloud
// export const CoverCloud = async (req, res, next) => {
//     const UserId = req.authUser._id
//     if (!req.file) {
//         return next(new Error('please upload your cover pictures'))
//     }
//     const coverImages = []
//     for (const file in req.files) {
//         for (const key of req.files[file]) {
//             const { secure_url, public_id } = await cloudinary.uploader.upload(
//                 key.path,
//                 {
//                     folder: `Users/Covers/${UserId}`,
//                     resource_type: 'image',
//                 },
//             )
//             coverImages.push({ secure_url, public_id })
//         }
//     }
//     const user = await UserModel.findById(UserId)

//     user.CoverPic.length
//         ? coverImages.push(...user.CoverPic)
//         : coverImages

//     const userNew = await UserModel.findByIdAndUpdate(
//         {_id:UserId},
//         {
//             CoverPic: coverImages,
//         },
//         {
//             new: true,
//         },
//     )
//     res.status(200).json({ message: 'Done', userNew })
// }


//delete user
export const deleteuser = async (req, res, next) => {
    const UserId = req.authUser._id
    const User = await UserModel.findById({ _id: UserId })
    if (!User) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    await cloudinary.api.delete_resources_by_prefix(`${process.env.PROJECT_FOLDER}/Users/Profiles/${User.CustomId}`)
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Users/Profiles/${User.CustomId}`)
    res.json({ message: 'Deleted' })
}
//Add Profile Picture Locally
export const AddProfilePictureLocally = async (req, res, next) => {
    const UserId = req.authUser._id
    if (!req.file) {
        return next(new Error('please upload your profile picture'))
    }
    const User = await UserModel.findByIdAndUpdate({ _id: UserId }, { ProfilePicture: req.file.path }, { new: true })
    res.json({ message: 'done', User })

}

//CoverImage Locally
// export const CoverPictureLocally = async (req, res, next) => {
//     const UserId = req.authUser._id
//     if (!req.file) {
//         return next(new Error('please upload your profile picture'))
//     }
//     const coverImages = []
//     // for (const file of req.files){CoverImage.push(file.path)} //array

//     for (const file in req.files) {
//         console.log(file) // image , cover
//         // console.log(req.files[file])
//         for (const key of req.files[file]) {
//             console.log(key)
//             coverImages.push(key.path)
//         }
//     }
//     const user = await UserModel.findById(_id)

//     user.CoverPicture.length
//         ? coverImages.push(...user.CoverPicture)
//         : coverImages

//     const userNew = await UserModel.findByIdAndUpdate(
//         { _id: UserId },
//         {
//             CoverPicture: coverImages,
//         },
//         {
//             new: true,
//         },
//     )
//     res.status(200).json({ message: 'Done', userNew })
// }


