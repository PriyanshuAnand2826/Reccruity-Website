const express = require("express")
const { route } = require("./user")
const router=express.Router()
const {Job} = require('../schemas/JobSchema')
const authMiddleware=require('../Middleware/auth')
const isAuth = require('../utils/auth')


router.post('/create',authMiddleware,async (req,resp)=>{
  try {
    const { name, logo, position, salary, jobType, remote, location, description, about, skills, information } = req.body;
    const { user } = req;
    const jobs = skills.split(",").map(skill => skill.trim());
    const job = new Job({ name, logo, position, salary, jobType, remote, location, description, about, skills: jobs, information, creator: user });
    await job.save();
    resp.status(200).json({ message: "Job created successfully" });
  } catch (error) {
    console.log(error);
    resp.status(400).json({ message: "Job not created" });
  } 

})

router.get('/',async (req,resp)=>{
  const isAuthenticated = isAuth(req)
  try {
    const jobs = isAuthenticated ? await Job.find() : await Job.find().select("-_id -creator -about -information");
    return resp.status(200).json({success:true,message:jobs})
  } catch (error) {
    return resp.status(401).json({success:false,message:"Job Not found due to internal error"})
  }
})
router.get('/:id',authMiddleware,async(req, resp)=>{
  try {
    const {id} = req.params
    const job=await Job.findById(id)
    if(!job) return resp.status(401).json({success:false,message:"Job not found"})
    return resp.status(200).json({success:true,message:job})
  } catch (error) {
    return resp.status(401).json({success:false,message:"Internal Error"})
  }
})

router.delete('/:id',authMiddleware, async(req, resp)=>{
  try {
    const {id} = req.params
    const job=await Job.findById(id)
    if(!job){
      return resp.status(401).json({success:false,message:"Job not found"})
    }
    if(job.creator.toString() !== req.user.toString()){
      return resp.status(401).json({success:false,message:"You are not authorized to delete this"})
    }
    await Job.findByIdAndDelete(id)
    return resp.status(200).json({success:true,message:"Job deleted"})

  } catch (error) {
    return resp.status(401).json({success:false,message:"Internal Error"})
  }
})

router.put('/:id',authMiddleware,async(req,resp)=>{
  try {
    const {id} = req.params
    const { name, logo, position, salary, jobType, remote, location, description, about, skills, information } = req.body;
    const jobSkills = skills?.split(",").map(skill => skill.trim());
    const job=await Job.findById(id)
    if(!job){
      return resp.status(401).json({success:false,message:"Job not found"})
    }
    if(job.creator.toString() !== req.user.toString()){
      return resp.status(401).json({success:false,message:"You are not authorized to update this"})
    }
    await Job.findByIdAndUpdate(id, { name, logo, position, salary, jobType, remote, location, description, about, skills: jobSkills, information }, { new: true })

    return  resp.status(200).json(job);
    
  } catch (error) {
    return resp.status(401).json({success:false,message:"Internal Error"})
  }
})

//search api 
router.get('/search/:title',async(req,resp)=>{
  try {
    const {title} =req.params
    const job = await Job.find({name: new RegExp (title,"i")}).select("-_id -creator -about -information");
    return resp.status(200).json(job);
  } catch (error) {
    return resp.status(401).json({success:false,message:"Internal Error"})
  }
})





module.exports=router