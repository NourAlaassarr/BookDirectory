import multer from "multer";
import { customAlphabet } from "nanoid";
import fs from'fs'
import path from "path";
import{allowedExtensions}from'../utlis/AllowedExtensions.js'
const nanoid= customAlphabet('1234ABC',5)



export const multerFunction=(allowedExtensionsArr,CustomPath)=>{
    if(!allowedExtensionsArr){
        allowedExtensionsArr=allowedExtensions.Image
    }
    if(!CustomPath){
        CustomPath='General'
    }
    const destPath =path.resolve(`Uploads/${CustomPath}`)
    if(!fs.existsSync(destPath)){
        fs.mkdirSync(destPath,{recursive:true})
    }
    //destnation
    //filename =>storage
      //================================== Storage =============================

    const storage = multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,destPath)
        },
        filename:function(req,file,cb){
            const Uniquename = nanoid()+file.originalname
            cb(null,Uniquename)
        },
        
    })
    //file filters
    const fileFilter=function(req,file,cb){
        if (allowedExtensionsArr.includes(file.mimetype)) {
            return cb(null, true)
        }
        cb(new Error('invalid extension', { cause: 400 }), false)
        }
        

    


    const fileUpload=multer({fileFilter,storage})
        return fileUpload
    
    }