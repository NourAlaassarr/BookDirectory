import mongoose, { model,Schema, syncIndexes } from "mongoose";
import {SystemRoles}from '../../src/utlis/SystemRoles.js'
import pkg from'bcrypt'
const UserSchema = new Schema({
    LastName:String,
    FirstName:String,
    
    UserName:{
        type:String,
        Unique:true,
        required:true,

    },

    Email:{
        type:String,
        Unique:true,
        required:true,
    },

    Phone:{
        required:true,
        type:String,
        Unique:true,

    },
    Age:Number,

    Address:[{
        type:String,
        required:true
        },
        ],

    Gender:{
        type:String,
        lowercase:true,
        enum:['female','male','not specified'],
        default:'not specified',
        },

    Password:{
        required:true,
        type:String,
    },

    ConfirmPassword:{
        required:true,
        type:String,
    },
    ChangePassAt:{
        type:Date
    },
    IsConfirmed:{
        type:Boolean,
        default:false,
    },

    isDeleted:{
        type:Boolean,
        default:false,
    },
    role:{
        type:String,
        enum:[SystemRoles.User,SystemRoles.Admin,SystemRoles.Super],
        default:SystemRoles.User,
    },
    token:{
        type:String
    },
    Code:{
        type:String,
        default:null
    },
    updatedAt:{
        type:Date
    },
    ChangePassAt:{
        type:Date
    },
    ProfilePic:{
        public_id:String,
        secure_url:String
    },
    
    CustomId:String,
    BookShelf:[
        {
            BookId:{
                type:Schema.Types.ObjectId,
                ref:'Book',
                required:true,
            },
            name:{
                type:String,
            },
            status:{
                type: String,
                enum:[SystemRoles.Read , SystemRoles.Currently_reading , SystemRoles.To_Read],
                default:SystemRoles.To_Read
            
        },
    }
],

Userstatus:{
    type:String,
    enum:[SystemRoles.Online,SystemRoles.Offline],
    default:SystemRoles.Offline

}
    
    // provider: {
    //     type: String,
    //     default: 'System',
    //     enum: ['System', 'GOOGLE', 'facebook'],
    // },


},{
    timestamps:true,
})

UserSchema.pre("save",function(next,hash){
    this.Password=pkg.hashSync(this.Password,+process.env.SALT_ROUNDS)
    this.ConfirmPassword=this.Password
    next()

})

export const UserModel = model('User',UserSchema)