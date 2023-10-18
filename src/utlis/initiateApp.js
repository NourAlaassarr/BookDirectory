import { DBConnection } from "../../DB/Connection.js"
import cors from 'cors'
import * as Routers from'../Modules/index.routes.js'
import { GlobalResponse } from "./ErrorHandling.js"
import router from "../Modules/Author/Author.routes.js"
import {ChangeCouponStatus}from'./CronJob.js'

export const InitiateApp=(App,express)=>{
    const Port=process.env.PORT ||5000
    App.use(express.json()) 
    //cors
    App.use(cors()) // allow anyone
    DBConnection()
    
    App.get('/',(req,res)=>res.send("Hello World!"))
    App.use('/Auth',Routers.AuthRoutes)
    App.use('/Book',Routers.BookRoutes)
    App.use('/Comment',Routers.CommentsRoutes)
    App.use('/Review',Routers.ReviewRoutes)
    App.use('/Author',Routers.AuthorRoutes)
    App.use('/Cart',Routers.CartRoutes)

    App.use('/Uploads',express.static('./Uploads'))//Locally
    App.all('*',(req,res,next)=>res.status(404).json({message:'URL NOT FOUND.'}))
    
    App.use(GlobalResponse)
    ChangeCouponStatus()
    App.listen(Port,()=>{
        console.log(`---------------Server is Running on port number ${Port} !---------------`)
    })
}