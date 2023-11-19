const COURT = require('../models/courtModel')
const mongoose=require('mongoose')
const COURTSHEDULES=require('../models/courtTimingSchema')
const getAllCourts=(req,res)=>{
COURT.find({}).then((resp)=>{
    res.json({msg:'success',data:resp})
})

}

const getSingleCourt=(req,res)=>{
    console.log(req.query.courtId);
    COURT.findOne({_id:req.query.courtId}).then((resp)=>{
        console.log(resp);
        
        const carousalimages=resp.image
    console.log(carousalimages);
    res.json({msg:'success',images:carousalimages,name:resp.name,description:resp.description,location:resp.location})
    })


}
const getSlotsData=(req,res)=>{
    console.log(req.query);
    COURTSHEDULES.aggregate([
        {
            $match:{
                courtId: new  mongoose.Types.ObjectId(req.query.courtId),
                date: new Date(req.query.date.split('T')[0]),
                "slot.id":{$gt:parseInt(req.query.currentHour)}
            }},
            {
                $lookup:
                {
from:"courts",
localField:"courtId",
foreignField:'_id',
as:"courts"
                }
            },
            {
                $project:{
_id:1,
date:1,
slot:1,
cost:1,
bookedBy:1,
courts:{$arrayElemAt:['$courts',0]}

}
            }
        
        ]).then((resp)=>{
            console.log(resp);
            if(resp.length){
                res.json({message:'success',data:resp})
            }
            else{
                res.json({message:"no court bookings"})
            }
          
        })
    
}
const getSingleUserBookings=(req,res)=>{
  console.log(req.userId);
  const currentDate=new Date()
  const slotId=currentDate.getHours()
  currentDate.setUTCHours(0,0,0,0)//to get only date month year format
  console.log(currentDate);

  console.log(slotId);
  COURTSHEDULES.aggregate([
    {$match:{
        bookedBy:new mongoose.Types.ObjectId(req.userId),
         $expr:{
              $or:[
{$gt:["$date",currentDate]},
{$and:[
    {$eq:["$date",currentDate]},
    {$gt:["$slot.id",slotId]},
],
},
    ],
},
    },
},
{
    $lookup:{
        from:"courts",
        localField:"courtId",
        foreignField:"_id",
        as:"courts"
    }
},{
    $project:{
        _id:1,
        date:1,
        slot:1,
        cost:1,
        courts:{$arrayElemAt:['$courts',0]}
    }
}
  ]).then((resp)=>{
    console.log(resp);
    res.status(200).json({msg:'success',data:resp})
  })
    
}

const getPreviousUserBookings=(req,res)=>{
    const currentDate=new Date()
    const slotId=currentDate.getHours()
    currentDate.setUTCHours(0,0,0,0)

COURTSHEDULES.aggregate([
    {
        $match:{
            bookedBy:new mongoose.Types.ObjectId(req.userId),
        $expr:{
            $or:[
{$lt:["$date",currentDate]},
{$and:[
    {$eq:["$date",currentDate]},
    {$lt:["$slot.id",slotId]}
]}
            ]
          
        }
    }
},
    {
        $lookup:{
            from:'courts',
            localField:"courtId",
            foreignField:"_id",
as:"courts"
        }
    },{
        $project:{
            _id:1,
            date:1,
            slot:1,
            cost:1,
            courts:{$arrayElemAt:['$courts',0]}
        }
    }
])
.then((resp)=>{
    console.log(resp);
    res.json({msg:'success',data:resp})
})
   

}

const getCancelledUserBookings= async (req,res)=>{
 
COURTSHEDULES.aggregate([
    {
        $unwind: "$canellation"
    },
    {
        $match:{
            "canellation.userId":req.userId
        }
    },

    {
        $lookup:{
            from:"courts",
            foreignField:'_id',
            localField:'courtId',
            as:"courts"
        }
    },

    {
        $project:{
            _id:1,
            date:1,
            slot:1,
            cost:1,
            canellation:1,
            courts:{$arrayElemAt:['$courts',0]}
        }
    }
    
]).then((resp)=>{
    console.log(resp);
    res.json({message:'success',data:resp})
})


}
module.exports={getCancelledUserBookings,getPreviousUserBookings,getAllCourts,getSingleCourt,getSlotsData,getSingleUserBookings}