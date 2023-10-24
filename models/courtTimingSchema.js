const mongoose=require('mongoose')


const courtTimingSchema=mongoose.Schema({
    date:{
type:Date,
required:true
    },
    slot:{
type:Object,
required:true
    },
    cost:{
type:Number,
required:true
    },
    bookedBy:{
type:mongoose.Types.ObjectId,
ref:'users'
    },
    canellation:{
type:Array
    },
    courtId:{
        type:mongoose.Types.ObjectId,
        ref:'courts'
    }
})

const courtShedules=mongoose.model('courtShedules',courtTimingSchema)
module.exports=courtShedules