import multer from "multer";
import{allowedExtensions}from'../utlis/AllowedExtensions.js'




export const multerCloudFunction=(allowedExtensionsArr)=>{
    if(!allowedExtensionsArr){
        allowedExtensionsArr=allowedExtensions.Image
    }
     //================================== Storage =============================
    const storage = multer.diskStorage({})
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