const jwt = require('jsonwebtoken')

const vendorAuth=(req,res,next)=>{
   
   
 const token=req.headers['authorization'].split(' ')//to get token with bearer string first

//console.log(jwt.decode(token[1]));
const decodedToken=jwt.decode(token[1]);//get the vendor details
if(decodedToken.role===2||decodedToken.role===3)//admin or vendor

{
  
   req.userId=decodedToken.userId //userid from jwtio website assigned to the req object

   next()
}
else{//user
res.status(401).json({message:'unauthorised request'})
}

}
module.exports=vendorAuth