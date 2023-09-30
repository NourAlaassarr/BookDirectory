import { DBConnection } from "../../DB/Connection.js"
import cors from 'cors'
import * as Routers from'../Modules/index.routes.js'
import { GlobalResponse } from "./ErrorHandling.js"


export const InitiateApp=(App,express)=>{
    const Port=process.env.PORT ||5000
    App.use(express.json()) 
    //cors
    App.use(cors()) // allow anyone
    DBConnection()
    
    App.get('/',(req,res)=>res.send("Hello World!"))
    App.use('/Auth',Routers.AuthRoutes)

    App.all('*',(req,res,next)=>res.status(404).json({message:'URL NOT FOUND.'}))
    
    App.use(GlobalResponse)
    App.listen(Port,()=>{
        console.log(`---------------Server is Running on port number ${Port} !---------------`)
    })
}