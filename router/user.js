const express=require("express")
const router=express.Router()
const {userAuth}=require('../middlewares/userAuth')
const {getAllCourts,getSingleCourt,getSlotsData,getSingleUserBookings,getCancelledUserBookings,getPreviousUserBookings}=require('../controllers/useController')

router.get('/getallcourts',userAuth,getAllCourts)
router.get('/getusersinglecourt',userAuth,getSingleCourt)
router.get('/getslotsdata',userAuth,getSlotsData)
router.get('/getSingleUserBookings',userAuth,getSingleUserBookings)
router.get('/getPreviousUserBookings',userAuth,getPreviousUserBookings)
router.get('/getCancelledUserBookings',userAuth,getCancelledUserBookings)
module.exports=router