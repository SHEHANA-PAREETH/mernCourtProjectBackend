const COURT = require('../models/courtModel')
const mongoose=require('mongoose')
const COURTSHEDULES=require('../models/courtTimingSchema')
const USER=require('../models/userModel')
const multer= require("multer")
const getAllCourts= async (req,res)=>{
    console.log(req.query);
    console.log(req.query.searchText);
   
    if(req.query.searchText){
        console.log(req.query.selectedPage);
        const page=req.query.selectedPage
        const pageSize=5
COURT.find({$or:[
    {name:{$regex:req.query.searchText,$options:'i'}},
    {location:{$regex:req.query.searchText,$options:'i'}},
    {description:{$regex:req.query.searchText,$options:'i'}}
]}).skip((page -1 )* pageSize).limit(pageSize).then((resp)=>{
    console.log(resp.length);//total documents
    res.status(200).json({msg:'success',data:resp,totaldocuments:resp.length})
}).catch((error)=>{
    res.status(400).json({msg:'something went wrong'})
})
    }
    else{
      console.log(req.query.selectedPage);
      const page=req.query.selectedPage
      const pageSize=5
      const documentCount= await COURT.countDocuments()
      console.log(documentCount); 
        COURT.find({}).skip((page -1 )* pageSize).limit(pageSize).then((resp)=>{
            console.log(resp.length);
            res.status(200).json({msg:'success',data:resp,totaldocuments:documentCount})
        }).catch((error)=>{
            res.status(400).json({msg:'something went wrong'})
        })
    }


}

const getSingleCourt= async (req,res)=>{
    console.log(req.query.courtId);
    const currentDate= new Date()
    const slotId=currentDate.getHours()
currentDate.setUTCHours(0,0,0,0)
console.log(currentDate);
const schedules= await COURTSHEDULES.aggregate([
    {
        $match:
        {
            courtId: new mongoose.Types.ObjectId(req.query.courtId),
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
        }
    },{
        $group:{
            _id:"$date",slotsData:{$push:{_id:"$_id"}}
        }
    }
])
    COURT.findOne({_id:req.query.courtId}).then((resp)=>{
        console.log(resp);
        
        const carousalimages=resp.image
    console.log(carousalimages);
    res.json({msg:'success',images:carousalimages,name:resp.name,description:resp.description,location:resp.location,schedules:schedules})
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
const uploadProfilePic=(req,res)=>{
    const fileStorage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'public/uploads')
        },
        filename:(req,files,cb)=>{
            cb(null,Date.now()+"-"+files.originalname)
        }
    })
    const upload=multer({storage:fileStorage}).single("image")
    
    
    
    upload(req,res,(err)=>{
      
        console.log(req.file);//single image req.file multiple req.files
        //enter to db
       USER.updateOne({_id:req.userId},{$set:{profilepic:req.file.filename}}).then((resp)=>{
        console.log('uploaded');
        res.json({msg:'success'})
       })
    
    })
}

const getProfiepic= async (req,res)=>{
    console.log('pppp');
   const result= await  USER.findOne({_id:req.userId},{profilepic:1})
   console.log(result);
   if(result.profilepic){
    console.log(result.profilepic);
    res.json({msg:"success",url:result.profilepic})
   }
   else{
    res.json({msg:"noprofilepic"})
   }
}
const getNumberofPages= async (req,res)=>{
    console.log('lll');
    const documentCount= await COURT.countDocuments()
   console.log(documentCount); 
   res.json({numberOfDocuments:documentCount})
}
module.exports={getCancelledUserBookings,getPreviousUserBookings,
    getAllCourts,getSingleCourt,getSlotsData,getSingleUserBookings,
    uploadProfilePic,getProfiepic,getNumberofPages}