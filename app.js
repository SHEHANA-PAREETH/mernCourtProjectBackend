const express=require('express')
const path=require("path")
const user=require('./router/user')
const admin=require('./router/admin')
const connectDB=require('./config/dbconfig')
const authRouter=require('./router/authRouter')
const vendor=require('./router/vendorRouter')
const payment=require('./router/payment')

const cors=require('cors')
const app=express()
require('dotenv').config()
const cookieParser=require('cookie-parser')
app.use(express.static(path.join(__dirname,"public")))
connectDB();

app.use(express.json())

app.use(express.urlencoded({extended:true}))
const corsOptions = {
     origin: '*',
     credentials:true,
     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
   }
app.use(cors(corsOptions))
app.listen(process.env.PORT,
     ()=>console.log('server running'));



app.use('/',user)
app.use('/admin',admin)
app.use('/auth',authRouter)
app.use('/vendor',vendor)
app.use('/payment',payment)