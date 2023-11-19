const express=require('express')
const router=express.Router()
const {myCourts,registerNewCourt,getSinglecourtData,addcourtTimings,getLatestUpdatedDate,getTableData,getOwnerDetails}=require('../controllers/vendorController')
const vendorAuth=require('../middlewares/vendorAuth')
const { userAuth } = require('../middlewares/userAuth')



router.post('/newcourtregistration',vendorAuth,registerNewCourt)
router.get('/mycourts',vendorAuth,myCourts)
router.get('/getSinglecourtdetails',vendorAuth,getSinglecourtData)
router.post('/addcourtTimings',vendorAuth,addcourtTimings)
router.get('/getlatestupdateddate',vendorAuth,getLatestUpdatedDate)
router.get('/gettabledata',vendorAuth,getTableData)
router.get('/getownerdetails',userAuth,getOwnerDetails)
module.exports=router