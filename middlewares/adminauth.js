const jwt = require('jsonwebtoken')

const AdminAuth=(req,res,next)=>{

    const token= req.headers['authorization'].split(' ')
    const decodedToken= jwt.decode(token[1])
    if(decodedToken.role=== 3){
        req.userId=decodedToken.userId //userid from jwtio website assigned to the req object

        next()
    }
else{
    res.status(401).json({message:'unauthorised request'})
}
}

module.exports={AdminAuth}