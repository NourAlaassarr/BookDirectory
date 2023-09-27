




export const InitiateApp=(App,express)=>{
    const Port=process.env.PORT ||5000
    App.use(express.json()) 


    App.listen(Port,()=>{
        console.log(`---------------Server is Running on port number ${Port} !---------------`)
    })
}