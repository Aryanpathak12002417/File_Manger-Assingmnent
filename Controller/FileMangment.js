const express=require('express')
const router=express.Router()
const aws=require('aws-sdk')
const fs=require('fs')
const s3=new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    })

const test=require('../Middleware/Tester')
const Auth = require('../Middleware/Auth')


router.post('/createFolder',Auth,(req,res)=>{
    const {folderName}=req.body;
    s3.putObject({
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:`${req.user}+${folderName}`,
        Body:''
    }).then((data)=>{
        console.log('Folder Created at'+ data.location);
        res.send("Folder Uplaoded Successfully")
    }).catch(err=>{
        console.log(err)
            res.send(err);
    })

})


router.post('/createSubFolder',Auth,(req,res)=>{

    const {parentPath,folderName}=req.body;
    s3.putObject({
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:`${req.user}+${parentPath+'/'+folderName}`,
        Body:''
    }).then((data)=>{
        console.log('Sub Folder Created at'+ data.location);
        res.send("SubFolder Created Successfuy")
    }).catch(err=>{
        console.log(err)
            res.send(err);
    })

})


router.post('/uploadFile',Auth,(req,res)=>{ 
    console.log(req.body)
    const {path}=req.body
    res.json({"path":`${req.user+'/'+path}`})
})



router.post('/fileDelete',Auth,(req,res)=>{

    const {fiePath}=req.body
    s3.deleteObject({
        Bucket:process.env.AWS_BUCKET_NAME,
        key:`${req.user}/${originalPath}`
    }).then(data=>{
        console.log('Data is Deleted')
        res.send('Data is Deleted SuccessFully')
    }).catch(err=>{
        console.log(err)
        res.send("File Cannot Be deleted")
    })

})

router.post('/fileUpdate',Auth,(req,res)=>{

    const {originalPath,newPath}=req.body
    s3.copyObject({
        Bucket:process.env.AWS_BUCKET_NAME,
        CopySource:`/${process.env.AWS_BUCKET_NAME}/${req.user}/${originalPath}`,
        key:`${req.user+newPath}`
    }).then(data=>{
        s3.deleteObject({
            Bucket:process.env.AWS_BUCKET_NAME,
            key:`${req.user}/${originalPath}`
        }).then(data=>{
            console.log('Data is Moved')
            res.send('Data is Moved Successfully')
        }).catch(err=>{
            console.log(err)
            res.send("File Cannotbe Uploaded")
        })
  }).catch(err=>{
        console.log(err)
        res.send(err)
    })


})

router.get('/testFile',Auth,(req,res)=>{
    res.send('Auth Wroking Properly')
})


module.exports=router