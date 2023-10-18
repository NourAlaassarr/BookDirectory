import {scheduleJob}from 'node-schedule'
import {CouponModel}from'../../DB/Models/Coupon.Model.js'
import { SystemRoles } from './SystemRoles.js';
import moment from 'moment-timezone';


export const ChangeCouponStatus=()=>{
    scheduleJob('*/60 * * * *', async function(){
        const IsValidCopoun = await CouponModel.find({CouponStatus:SystemRoles.Valid})
        for(const Coupon of IsValidCopoun){
            if(moment(Coupon.ToDate).isBefore(moment().tz('Africa/Cairo'))){
                Coupon.CouponStatus=SystemRoles.Expired
                await Coupon.save()
            }
        }
        console.log('cron changecoupon is running..............')
    })

}

// export const Job =()=>{
//     scheduleJob('* /1 * * * *',function(){
//         console.log('The answer to life, the universe, and everything!');
//     })
// }