import mongoose from "mongoose"




export const DBConnection= async()=>{

return await mongoose.connect(process.env.DBCONNECTION_URL_CLOUD)
.then((res)=>console.log('Connection has been established successfully.'))
.catch((err)=>console.log('Unable to connect to the database.',err))
}

