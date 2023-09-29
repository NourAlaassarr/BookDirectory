import mongoose, { model,Schema, syncIndexes } from "mongoose";
import {SystemRoles}from '../../src/utlis/SystemRoles.js'

const UserSchema = new Schema({
    UserName:{
        type:String,
        Unique:true,
        required:true,

    },

    Emai:{
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
        lowercase:true,
        enum:[SystemRoles.User,SystemRoles.Admin,SystemRoles.Super],
        default:SystemRoles.User,
    },
    
    // provider: {
    //     type: String,
    //     default: 'System',
    //     enum: ['System', 'GOOGLE', 'facebook'],
    // },


},{
    timestamps:true,
})


export const UserModel = model('User',UserSchema)