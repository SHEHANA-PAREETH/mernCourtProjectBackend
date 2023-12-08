const express=require('express')
const router=express.Router()
const {addslotsoPreviousSlots,getAllShedulesData,myCourts,registerNewCourt,getSinglecourtData,addcourtTimings,getLatestUpdatedDate,getTableData,getOwnerDetails,showSlotBookingDetails}=require('../controllers/vendorController')
const vendorAuth=require('../middlewares/vendorAuth')
const { userAuth } = require('../middlewares/userAuth')



router.post('/newcourtregistration',vendorAuth,registerNewCourt)
router.get('/mycourts',vendorAuth,myCourts)
router.get('/getSinglecourtdetails',vendorAuth,getSinglecourtData)
router.post('/addcourtTimings',vendorAuth,addcourtTimings)
router.get('/getlatestupdateddate',vendorAuth,getLatestUpdatedDate)
router.get('/gettabledata',vendorAuth,getTableData)
router.get('/getownerdetails',userAuth,getOwnerDetails)
router.get('/getallshedulesdata',vendorAuth,getAllShedulesData)
router.get('/showSlotBookingDetails',vendorAuth,showSlotBookingDetails)
router.post('/addslotsopreviousslots',vendorAuth,addslotsoPreviousSlots)
module.exports=router