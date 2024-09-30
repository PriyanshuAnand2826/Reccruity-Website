require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const app=express();
const PORT=process.env.PORT
const {incomingRequestLogger}=require('./Middleware/index')
const userRouter=require('./Routes/user')
const jobRouter = require ('./Routes/job')


//middlewares

//these two lines are used to take data from any field like form or json 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(incomingRequestLogger)
app.use('/recruity/user',userRouter)
app.use('/recruity/job',jobRouter)










app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`)
  mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("db connected sucessfully");
  })
}); 