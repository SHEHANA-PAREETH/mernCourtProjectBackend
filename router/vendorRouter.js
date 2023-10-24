const express=require('express')
const router=express.Router()
const {myCourts,registerNewCourt,getSinglecourtData,addcourtTimings,getLatestUpdatedDate}=require('../controllers/vendorController')
const vendorAuth=require('../middlewares/vendorAuth')



router.post('/newcourtregistration',vendorAuth,registerNewCourt)
router.get('/mycourts',vendorAuth,myCourts)
router.get('/getSinglecourtdetails',vendorAuth,getSinglecourtData)
router.post('/addcourtTimings',vendorAuth,addcourtTimings)
router.get('/getlatestupdateddate',vendorAuth,getLatestUpdatedDate)
module.exports=router