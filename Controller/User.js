const express=require('express')
const jwt=require('jsonwebtoken')
const router=express.Router()


router.post('/register',(req,res)=>{
    const {firstName,lastName,userHandle,email}=req.body
    console.log(firstName,lastName,userHandle,email)
    const token=jwt.sign({"user":userHandle},process.env.AUTH_SECRET_KEY,{expiresIn:'5d'});
    res.cookie('Token',token)
    res.send('Register Routes')
})

router.post('/login',(req,res)=>{
    res.send('Login Route')
})


module.exports=router