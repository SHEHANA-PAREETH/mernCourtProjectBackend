const express=require('express')
const {userSignup,userLogin} = require('../controllers/auth')
const router=express.Router()


router.post('/register',userSignup)
router.post('/login',userLogin)

module.exports=router