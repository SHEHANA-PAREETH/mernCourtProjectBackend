 const express=require('express')
const multer =require('multer')
const USER=require('../models/userModel')
const COURTSHEDULES=require('../models/courtTimingSchema')
const COURT = require('../models/courtModel')
const mongoose=require('mongoose')

const registerNewCourt=(req,res)=>{
   
  
   const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/uploads')
    },
    filename:(req,files,cb)=>{
        cb(null,Date.now()+"-"+files.originalname)
    }
})
const upload=multer({storage:fileStorage}).array("images",5)



upload(req,res,(err)=>{
    console.log(req.body);
    console.log(req.files);
    COURT({
        name:req.body.name,
        location:req.body.location,
        description:req.body.description,
       
        image:req.files,
        userId:req.userId
    }).save().then((resp)=>{
        if(resp)
        res.status(200).json({courtregister:true})
    else{
res.status(403).json({courtregister:false})
    }
    })

})
}
const myCourts=(req,res)=>{
   
   COURT.find({userId:req.userId}).then((resp)=>{

    res.json({msg:'success',data:resp})
   })

}
const getSinglecourtData=(req,res)=>{

   COURT.findOne({_id:req.query.courtId}).then((resp)=>{
    const carousalimages=resp.image
    console.log(carousalimages);
    res.json({msg:'success',images:carousalimages,name:resp.name,description:resp.description,location:resp.location})
   })

}
const  addcourtTimings= (req,res)=>{
    try {
        console.log(req.body);
    let currentDate=new Date(req.body.starEndDate.startingDate)
    let endDate=new Date(req.body.starEndDate.endingDate)
   const timingObjectArray=[]
  
    while(currentDate<=endDate){
     
            req.body.slotLists.forEach((obj)=>{
                timingObjectArray.push({
                     date:JSON.parse(JSON.stringify(currentDate)) ,
                     slot:{
                         name:obj.name,
                         id:obj.id
                     },
                     cost:req.body.cost,
                     courtId:req.body.courtId
                 })
                })   
             
            
        
             currentDate.setDate(currentDate.getDate()+1)
    }
  
    console.log( timingObjectArray);
   
   
    

COURTSHEDULES.insertMany(timingObjectArray).then((resp)=>{
    res.status(200).json({msg:'shedules added successfully'})
})
    } catch (error) {
        res.status(500).json(error)
    }
    
    
}

const getLatestUpdatedDate=(req,res)=>{
    console.log(req.query.courtId);
    COURTSHEDULES.find({courtId:req.query.courtId}).then((resp)=>{
if(resp.length===0){
    
    res.json({msg:'failed'})
   
}
else
{
    COURTSHEDULES.find({courtId:req.query.courtId}).sort({date:-1}).limit(1).select('date').then((resp)=>{
        console.log(resp[0].date);
        res.json({msg:'success',minDate:resp[0].date})
    })
   
   
}
    })
  

}

const getTableData=(req,res)=>{
    console.log(req.query.id);
    console.log(req.query.startDate);
    console.log(req.query.endDate);
    COURTSHEDULES.find({courtId:req.query.id,$and:[{date:{$gte:req.query.startDate}},{date:{$lte:req.query.endDate}}]}).then((resp)=>{
        console.log(resp);
        res.json({msg:'success',data:resp})
    })
    
}
const getOwnerDetails=(req,res)=>{
    console.log(req.query.vendorId);
USER.findOne({_id:req.query.vendorId}).then((resp)=>{
    console.log(resp);
    res.json({msg:'success',data:resp})
})
  
}
module.exports= {getOwnerDetails,registerNewCourt,myCourts,getSinglecourtData,addcourtTimings,getLatestUpdatedDate,getTableData}
