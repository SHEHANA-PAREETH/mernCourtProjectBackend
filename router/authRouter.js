const express=require('express')
const {userSignup,userLogin} = require('../controllers/auth')
const {ForgotPaasword,verifyOtp,resetPassword} =require('../controllers/forgotPaasword')
const router=express.Router()


router.post('/register',userSignup)
router.post('/login',userLogin)
router.get('/forgotPassword',ForgotPaasword)
router.get('/verifyotp',verifyOtp)
router.get('/resetpassword',resetPassword)
module.exports=router