import Jwt  from "jsonwebtoken";



export const GenerateToken=({
    payload={},
    signature=process.env.SIGNATURE_DEFAULT,
    expiresIn='1d'

}={})=>{
    //check payload
    if(!Object.keys(payload).length){
        return false
    }

    const Token =Jwt.sign(payload,signature,{expiresIn})
    return Token  
}


export const VerifyToken=({
    token='',
    signature=process.env.SIGNATURE_DEFAULT,
    expiresIn='1d',
}={})=>{
    //check payload
    if(!token){
        return false
    }

    const data =Jwt.verify(token,signature)
    return data  
}