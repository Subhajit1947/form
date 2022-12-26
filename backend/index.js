const mongoose=require('mongoose')
const express=require('express')
const cors = require('cors')
const nodemailer = require("nodemailer");
const { json } = require('express');
const app = express()
const mongoURL='mongodb+srv://subhajit:r4P7M7Xuher2Iflt@cluster0.6iidrns.mongodb.net/?retryWrites=true&w=majority'
app.use(express.json())
app.use(cors())
mongoose.connect(mongoURL).then(()=>{
    console.log('dbconnect')
})
.catch((err)=>{
    console.log(err.message)
})
let formschma=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mob:{
        type:Number,
        required:true,
        maxLength:10,
        minLength:10
    },
    email:{
        type:String,
        reqiured:true,
        unique:true
    },
    hobbi:{
        type:String,
        required:true
    }
})
const userform=mongoose.model('userform',formschma)
app.post('/',async(req,res)=>{
    let userdata=await userform.create(req.body)
    res.json(userdata)
})
app.get('/',async(req,res)=>{
    let udata=await userform.find()
    res.json(udata)
})
app.post('/de',async(req,res)=>{
    let duser=await userform.findOneAndDelete(req.body)
    res.json({
        message:'sucessfuly delete'
    })
})
app.post('/sm',async(req,res)=>{
    let sdata=req.body
    sendemail(sdata)
    res.json({
        message:'mail send successfully'
    })
})
app.listen(4000)




async function sendemail(obj) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:obj.email,
        pass:obj.password
    },
  });
  let mailDetails = {
    from: obj.email,
    to: "info@redpositive.in",
    subject: 'Test mail',
    text: 'user information',
    html:JSON.stringify(obj.userd)
    };
    transporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');           
        } else {
            console.log('Email sent successfully');       
        }
    }); 
}

