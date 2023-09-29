import { DBConnection } from "../../DB/Connection.js"
import cors from 'cors'


export const InitiateApp=(App,express)=>{
    const Port=process.env.PORT ||5000
    App.use(express.json()) 
    DBConnection()
    
    //cors
    App.use(cors()) // allow anyone
    App.get('./',(req,res)=>res.send("Hello World!"))
    App.all('*',(req,res,next)=>res.status(404).json({message:'URL NOT FOUND.'}))
    App.listen(Port,()=>{
        console.log(`---------------Server is Running on port number ${Port} !---------------`)
    })
}