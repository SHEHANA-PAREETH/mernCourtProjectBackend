const crypto = require('crypto');
const nodemailer = require('nodemailer');
const USER=require('../models/userModel')
const bcrypt=require('bcrypt')
let generatedPassword;
const ForgotPaasword= async (req,res)=>{

console.log(req.query.email);


// Function to generate a random password
function generateRandomPassword(length) {
  return crypto.randomBytes(length).toString('hex');
}

// Function to send an email with the generated password
async function sendPasswordEmail(email, password) {
  // Create a nodemailer transporter
  let transporter = nodemailer.createTransport({
    service:"Gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'shehanapareeth1@gmail.com',
      pass: 'yavq baof ttel cgsv'//generated by turning on 2step verification
    }
  });

  // Email options
  let mailOptions = {
    from: 'shehanapareeth1@gmail.com',
    to: email,
    subject: 'Temporary Password',
    text: `Your temporary password: ${password}. It will expire in 10 minutes.`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}

// Example usage

generatedPassword = generateRandomPassword(3); // You can adjust the password length

// Send the email with the generated password
 await sendPasswordEmail(req.query.email, generatedPassword);
 res.json({msg:'success'})
passwordExpiry()
}
const passwordExpiry=()=>{
    setTimeout(()=>{
        generatedPassword = null
    },300000)
}

const verifyOtp=(req,res)=>{
   console.log(generatedPassword);
    console.log(req.query);
    if(req.query.otpvalue === generatedPassword){
res.json({msg:'success'})}
else{
    res.json({msg:'failed'})
}
    
}
const resetPassword= async (req,res)=>{
console.log(req.query);
const result= await USER.findOne({email:req.query.email})
if(result){
    console.log(result);

    const saltRounds = 10
    bcrypt.genSalt(saltRounds)
    .then(salt => {
      console.log('Salt: ', salt)
      return bcrypt.hash(req.query.password1, salt)
    })
    .then(hash => {
      console.log('Hash: ', hash)
     
     USER.updateOne({email:result.email},{$set:{password1:hash}}).then((updated)=>{
        if(updated){
            console.log('password updated');
        res.json({"passwordupdated":true})}
    else{
        res.json({"passwordupdated":false})
        
    }   
})
})
}
else{
res.json({msg:'no user exists'})
}
}
module.exports={ForgotPaasword,verifyOtp,resetPassword}