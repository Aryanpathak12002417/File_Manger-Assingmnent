const express=require('express')
const dotenv=require('dotenv').config({});
const cookieParser=require('cookie-parser')
const app=express();
const routes=require('./Routes/Routes')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(routes)

app.listen(process.env.PORT,()=>{
    console.log(`Running at port ${process.env.PORT}`)
})