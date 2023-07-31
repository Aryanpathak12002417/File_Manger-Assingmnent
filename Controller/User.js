const express=require('express')
const jwt=require('jsonwebtoken')
const db=require('../Utilies/database')
const bcrypt=require('bcryptjs')
const router=express.Router()


router.post('/register',async (req,res)=>{
    const {firstName,lastName,userHandle,email,password}=req.body
    const bpassword=await bcrypt.hash(password)
    db.query(`INSERT INTO users (firstName, lastName, userHandle,email,password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`,[firstName,lastName,userHandle,email,bpassword],(err,result)=>{
        if(err){
            return res.send({message:'Cannot Register Now'})
        }
        else{
            const token=jwt.sign({"user":userHandle},process.env.AUTH_SECRET_KEY,{expiresIn:'5d'});
            res.cookie('Token',token)
            return res.json({message:"Successfully Created profile"})
        }
    })
})

router.post('/login',(req,res)=>{
    const {email,password}=req.body;
    db.query(`SELECT * FROM users WHERE email=$1`,[email],(err,result)=>{
        if(err){
            return res.status(500).json({message:'Internal Server Error'})
        }
        const user=result.rows[0];

        if(!user){
            return res.status(400).json({message:"Please Check Your Email-id Servers"})
        }

        bcrypt.compare(password,user.password,(bErr,bResult)=>{
            if(bErr){
                return res.status(500).json({message:"Internal Server Error"})
            }
            if(!bResult){
                return res.status(400).json({message:"Password do not match"})
            }
            const token=jwt.sign({"user":user.userHandle},process.env.AUTH_SECRET_KEY,{expiresIn:'5d'});
            res.cookie('Token',token)
            return res.status(200).json({message:"Successfully Logged in"})
        })
    })
})


module.exports=router