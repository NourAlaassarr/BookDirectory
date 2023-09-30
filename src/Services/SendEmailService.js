import nodemailer from'nodemailer'

export async function sendmailService({
    
    to,
    subject,
    Message,
    attachments=[]

}={}){
//configurations
const Transporter=nodemailer.createTransport({
    host:'localhost',
    port:587, //465
    secure:false, //true(tls)
    service:'gmail',

    auth:{
    //credentials
    user:"nonaalaassar@gmail.com",
    pass:"xgkd fsye lgni vahv"
    },

    // tls:{
    //     rejectUnauthorized:false
    // }
    
    })
    const EmailInfo=await Transporter.sendMail({
        from:'"route 👻"<nonaalaassar@gmail.com>',
        to:to?to:'null',
        subject:subject ? subject :'Hello',
        html:Message ? Message :'',
        attachments,

    })
    if (EmailInfo.accepted.length) {
        return true
    }
    return false
        
}
