const USER= require('../models/userModel')
const COURTSHEDULES=require('../models/courtTimingSchema')
const mongoose=require('mongoose')
const COURT= require('../models/courtModel')
const courtShedules = require('../models/courtTimingSchema')
const getUserData=(req,res)=>{
USER.find({
    role:1
}).then((resp)=>{
    res.json({msg:'success',data:resp})
})
}
const getbookedDetails=(req,res)=>{
   console.log(req.query.id);
COURTSHEDULES.aggregate([
    {
        $match:
        {
            bookedBy: new mongoose.Types.ObjectId(req.query.id)
        }
      
    },
    {
        $lookup:{
            from:"courts",
            localField:"courtId",
            foreignField:"_id",
            as:"courts"
        }
    },{
$group:{
    _id:"$date",slotsData:{$push:{slot:"$slot",cost:"$cost",id:"$_id",courtId:"$courtId",courts:{$arrayElemAt:['$courts',0]}}}
}
    },
    {
            $sort:{
                _id:1
            }
        }
]).then((resp)=>{
    console.log(resp);
    if(resp){
        res.json({msg:"success",data:resp})
    }
    else{
        res.json({msg:'no couarts booked yet'})
    }
})


}
const vendorDetails=(req,res)=>{
    USER.find({role:2}).then((resp)=>{
        res.json({msg:'success',data:resp})
    })
}

const getcourtDetails= async (req,res)=>{
    let allcourts=[]
    allcourts= await COURT.find({userId:req.query.id})
    //console.log(resp);
   
    //console.log(allcourts);
   


res.json({msg:"success",data:allcourts})

}

const allbookedCourts= async (req,res)=>{
    const result= await COURTSHEDULES.aggregate([
        {
            $match:{
                "bookedBy": { $exists: true, $ne: null }
            }
        },{
            $lookup:{
                from:"courts",
                localField:"courtId",
                foreignField:"_id",
                as:"courts"
            }
        },
        {
$lookup:{
    from:"users",
    localField:"bookedBy",
    foreignField:"_id",
    as:"users"
}
        },
        
        {
            $project:
            {
                _id:1,
                date:1,
                slot:1,
                cost:1,
                bookedBy:1,
                paymentOrders:1,
                courts:{$arrayElemAt:['$courts',0]},
                users:{$arrayElemAt:['$users',0]}
            }
        }

    ])
   //const result= await COURTSHEDULES.find({ "bookedBy": { $exists: true, $ne: null } })
   console.log(result);
   for(let i=0;i<result.length;i++){
   
   const vendor= await USER.findOne({_id:result[i].courts.userId})
 result[i].vendorname = vendor.firstName+" "+vendor.lastName
 result[i].number=vendor.number  
 console.log(result[i]);
} 
  
   res.json({msg:"success",data:result})
}
const cancelledCourts= async (req,res)=>{
    const result= await COURTSHEDULES.aggregate([
        {
            $match:
            {
               "canellation":{ $exists: true, $not: {$size : 0} }//canelation array contains elements
            }
        },
        {
            $lookup:
            {
                from:"courts",
                localField:"courtId",
                foreignField:"_id",
                as:"courts"
            }
        },
        {
            $project:
            {
                _id:1,
                date:1,
                slot:1,
                cost:1,
                bookedBy:1,
                paymentOrders:1,
                canellation:1,
                courts:{$arrayElemAt:['$courts',0]}
               
            }
        }
    ])
    for(let i=0;i< result.length;i++){
      console.log(result[i].canellation.length);
   
      for(let j=0;j<result[i].canellation.length;j++){
        const user= await USER.findOne({_id:result[i].canellation[j].userId})
        console.log(user.firstName);
        result[i].canellation[j].username=user.firstName+" "+user.lastName
      }
    }
    console.log(result);
    res.json({msg:"success",data:result})
}

const getChartData=(req,res)=>{
    COURTSHEDULES.aggregate([
        {
            $match:
            {
               "bookedBy":{ $exists: true, $not: {$size : 0} }//canelation array contains elements
            }
    },{
        $group:{//create new accumulator slotsdata
            _id:"$date",slotsData:{$push:{slot:"$slot",cost:"$cost",id:"$_id",courtId:"$courtId"}}
                        }
    },{
        $sort:{
            _id:1
        }
    }
]).then((resp)=>{
    console.log(resp);
    res.json({msg:"success",data:resp})
})
}
module.exports={cancelledCourts,getUserData,getbookedDetails,vendorDetails,getcourtDetails,allbookedCourts,getChartData}