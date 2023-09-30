
export const asyncHandler =(API)=>{
    return (req,res,next)=>{
        API(req,res,next).catch(async(err)=>{
            console.log(err)
            return next (new Error ('Fail',{cause:500}))
        })
    }

}
export const GlobalResponse =(err,req,res,next)=>
{
    if(err)
    {
    return res.status(err['cause'] || 500).json({Message:err.message})
    
    //     if(req.ValidationErrArray)
    //     {
    //         return res.status(err['cause'] || 400).json({Message:req.ValidationErrArray})
    //     }
    //     return res.status(err['cause'] || 500).json({Message:err.message})

}
}