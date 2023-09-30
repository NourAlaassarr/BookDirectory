import {UserModel} from '../../../DB/Models/User.Model.js'
import {GenerateToken,VerifyToken}from '../../utlis/TokenFunction.js'
import pkg from 'bcrypt'
import {sendmailService} from '../../Services/SendEmailService.js'
import {emailTemplate}from'../../utlis/EmailTemplate.js'

//SignUp
export const SignUp = async(req,res,next)=>{
    const {Email , Password,ConfirmPassword,Gender,Address,Phone,UserName,FirstName,LastName}=req.body

    //check for duplication UserName/email
    const EmailCheck= await UserModel.findOne({Emai:Email})
    if(EmailCheck){
        return next (new Error('Email is Already Exsit', { cause: 400 }))
    }
    const Check = await UserModel.findOne({UserName:UserName})
    if(Check){
        return next (new Error('UserName is Already Exsit', { cause: 400 }))
    }
//-----------------------------------------------------------------------------
    if(Password!==ConfirmPassword){
        return next (new Error('Password Does\'t Match', { cause: 400 }))
    }
    //HashPassword 
    // const HashPassword= pkg.hashSync(PassWord,8)
    //Using HOOKS
    
//------------------Confirm Email Token------------------------------------------------
    const Token = GenerateToken({
        payload:{Email},
        signature:process.env.SIGNATURE_CONFIRMATION_EMAIL,
        expiresIn:'1d'
    })
const ConfirmationLink=`${req.protocol}://${req.headers.host}/Auth/confirm/${Token}`
const IsEmailSend = sendmailService({
    to:Email,
    subject:'Confirmation Email',
    Message:emailTemplate({
        link:ConfirmationLink,
        linkData: 'Click here to Confirm',
        subject: 'Confirmation Email'
    })
})
if (!IsEmailSend) {
    return next(new Error('Failed to send Confirmation Email', { cause: 400 }))
}



const UserObject =new UserModel({
        Email , 
        Password,
        ConfirmPassword,
        Gender,
        Address,
        Phone,
        UserName,
        

    })
    const User= await UserObject.save()
    res.status(202).json({Message:'Sign-Up Successfully',User})
}

//Confirm Email
export const ConfirmEmail= async(req,res,next)=>{
    const{Token}=req.params
    const DecodedData=VerifyToken({token:Token,signature:process.env.SIGNATURE_CONFIRMATION_EMAIL})
    const CheckUser = await UserModel.findOneAndUpdate({Email:DecodedData?.Email,IsConfirmed: false},{
        IsConfirmed:true

    },{
        new:true
    })
    if(!CheckUser){
        return next (new Error('Already Confirmed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Successfully Confirmed,Try to log in' })
}

//Sign in
export const SignIn=async(req,res,next)=>{
    const {EmaiL,Password}=req.body
    const Usercheck = await UserModel.findOne(EmaiL)
    if(!Usercheck)
    {
        return next (new Error('Invalid Credentials',{cause:400}))
    }
    const IsPasswordMatch = pkg.compareSync(Password, Usercheck.Password)
    if (!IsPasswordMatch) {
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const Token = GenerateToken({payload:{
        EmaiL:Usercheck.Email,
        _id:Usercheck._id,
    },
signature:process.env.SIGN_IN_TOKEN_SECRET,
expiresIn:'1d'})
const UserUpdate=await UserModel.findOneAndUpdate({EmaiL},{
    token:Token,
    is_Online:true
},{
    new:true
})
res.status(200).json({ Message: "Successfully Logged IN", UserUpdate })

}

//UpdateProfile(Email,Phone)
export const Update = async (req,res,next)=>{
    const {Phone,Email}=req.body
    const UserId=req.authUser._id
    const Ifexist = await UserModel.findById({_id:UserId})
    if(!Ifexist){
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    const checkPhone = await UserModel.findOne({Phone:Phone})
    if(checkPhone){
        return next (new Error ('Phone Number Already Exist, Please Choose Another Phone Number',{cause:400}))
    }
    //------------------Confirm Email Token------------------------------------------------
    if(req.body.Email){

    const CheckEmail = await UserModel.findOne({ Email:Email})
    if(CheckEmail){
        return next (new Error ('Email ALready exist',{cause:400}))
    }

    const Token = GenerateToken({
        payload:{Email},
        signature:process.env.SIGNATURE_CONFIRMATION_EMAIL,
        expiresIn:'1d'
    })
const ConfirmationLink=`${req.protocol}://${req.headers.host}/Auth/confirm/${Token}`
const IsEmailSend = sendmailService({
    to:Email,
    subject:'Confirmation Email',
    Message:emailTemplate({
        link:ConfirmationLink,
        linkData: 'Click here to Confirm',
        subject: 'Confirmation Email'
    })
})
if (!IsEmailSend) {
    return next(new Error('Failed to send Confirmation Email', { cause: 400 }))
}
await UserModel.findByIdAndUpdate({_id:UserId},{IsConfirmed:false})
    }

    const toBeUpdated = await UserModel.findByIdAndUpdate({_id:UserId},{...(Email && {Email}),...(Phone && {Phone})},{new:true})
    res.status(200).json({ Message: "Updated Successfully",toBeUpdated  })
    
}

//Update(Password)
export const UpdatePassword= async(req,res,next)=>{
    const UserId=req.authUser._id

}


//ForgetPass&Reset


//Add Profile Picture 


//SoftDelete Profile


//RefreshToken


