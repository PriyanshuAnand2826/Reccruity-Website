const express = require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {User} = require('../schemas/UserSchema')

router.get('/',async (req,resp)=>{
  return resp.status(200).json("hello recruity")
})

router.post('/signup',async (req,resp)=>{
  try {
    const {name,email,password,mobile}=req.body
    const hashedPass=await bcrypt.hash(password,10)
    const user= await new User({name,email,password:hashedPass,mobile})
    user.save()
    return resp.status(200).json({success:true,message:"user created"})
  } catch (error) {
    return  resp.status(400).json({success:false,message:error.message})

  }
 
})


router.post('/login',async (req,resp)=>{
  try {
    const {email,password}=req.body
    const user =await User.findOne({email})
    if(!user){
      return resp.status(400).json({success:false,message:"User not login"})
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
      return resp.status(400).json({success:false,message:"Password is wrong"})
    }
    const payload = { id: user._id };
    const token=jwt.sign(payload,process.env.JWT_SECRET)
    return resp.status(200).json({success:true,message:"User login",token:token})
  }
  
  catch (error) {
    return  resp.status(400).json({success:false,message:error.message})

  }
 
})

module.exports=router

