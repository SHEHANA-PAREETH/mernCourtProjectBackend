const express=require('express')
const { AdminAuth } = require('../middlewares/adminauth')
const { getUserData,getbookedDetails,vendorDetails,getcourtDetails,allbookedCourts,cancelledCourts,getChartData } = require('../controllers/admincontroller')
const router=express.Router()

router.get('/getuserdata',AdminAuth,getUserData)
router.get('/getbookedDetails',AdminAuth,getbookedDetails)
router.get('/vendordetails',AdminAuth,vendorDetails)
router.get('/getcourtDetails',AdminAuth,getcourtDetails)
router.get('/allbookedcourts',AdminAuth,allbookedCourts)
router.get('/cancelledcourts',AdminAuth,cancelledCourts)
router.get('/chartdata',AdminAuth,getChartData)

module.exports=router