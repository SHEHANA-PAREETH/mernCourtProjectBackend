 const USER = require('../models/userModel')
 const mongoose=require('mongoose')
 const bcrypt=require('bcrypt')
 const jwt=require('jsonwebtoken')

 const userSignup= async (req,res)=>{
console.log(req.body);
const email= await USER.findOne({email:req.body.email})
const number= await  USER.findOne({number:req.body.number})
    if(email || number){
      if(email && number){
        console.log('user exists');
        res.json({usercreated:false,serverconnected:true,msg:'user exists'})
      }
      else{
        if(number){
          console.log('number exists');
          res.json({usercreated:false,serverconnected:true,msg:'number exists'})
        }
        else {
          console.log('email exists');
          res.json({usercreated:false,serverconnected:true,msg:'email exists'})
        }
      }
       
       
    }
    

else{
  
    const saltRounds = 10
    bcrypt
    .genSalt(saltRounds)
    .then(salt => {
      console.log('Salt: ', salt)
      return bcrypt.hash(req.body.password1, salt)
    })
    .then(hash => {
      console.log('Hash: ', hash)
      let role;
      if(req.body.role){
        role=2;//vendor
      }
      else{
        if(req.body.email==="admin123@gmail.com"){
          role=3;//admin
        }
        else{
          role=1;//user
        }
      
      }
   
      USER({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        number:req.body.number,
        password1:hash,
        role:role
    }).save().then((response)=>{
        console.log('user created');
        res.json({usercreated:true,serverconnected:true})
    }).catch(()=>{
        res.json({usercreated:false,serverconnected:false})
        
    }   
    )  
})
    
    .catch(err => console.error(err.message))
   
}

}

const userLogin = async (req,res)=>{
    console.log(req.body);
   
  const finduser = await  USER.findOne({email:req.body.email})
  console.log(finduser);
  
  if(finduser)
  {
   
      bcrypt
      .compare(req.body.password, finduser.password1)
      .then(resp => {
        console.log(resp ) // return true
        if(resp){
            
            const token=jwt.sign({userId:finduser._id,email:finduser.email,firstName:finduser.firstName,lastName:finduser.lastName,role:finduser.role},process.env.JWT_KEY,{expiresIn:'2d'})
     
     res.cookie('userJwt',token,{
      httpOnly:true,
      samSite:'lax',
      secure:false,
      maxAge:24*60*60*1000
     })
     console.log(token);
     finduser.password1=undefined; 
     if( finduser.profilepic){
      finduser.profilepic=undefined; 
     }
    
      res.status(200).json({msg: 'user login success',token:token,user:finduser})
  }
  
      else{
        res.json({msg:'password incorrect'})
      }
      })
      .catch(err => console.error(err.message)) 
    
    
  }
     
  else{
    res.json({msg:"invalid credentials"})
  }
 
     
  }
  
  


 module.exports={userSignup,userLogin}