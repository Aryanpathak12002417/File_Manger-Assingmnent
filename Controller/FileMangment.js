const express=require('express')
const router=express.Router()
const fs=require('fs')
const aws=require('../Utilies/aws')
const db=require('../Utilies/database')

const s3=new aws.S3()
const Auth = require('../Middleware/Auth')


router.post('/createFolder',Auth,(req,res)=>{

    const {folderName}=req.body;
    db.query(`INSERT INTO user_files (userHandle, file_path) VALUES ($1, $2) RETURNING *;`,[userHandle,`${req.user}/${folderName}`],(err,result)=>{
        if(!err){
            return res.status(500).json({message:"Internal Server Error"})
        }

        s3.putObject({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`${req.user}/${folderName}`,
            Body:''
        }).then((data)=>{
            console.log('Folder Created at'+ data.location);
            res.send("Folder Uploaded Successfully")
        }).catch(err=>{
            console.log(err)
                res.send(err);
        })

    })

})


router.post('/createSubFolder',Auth,(req,res)=>{

    const {parentPath,folderName}=req.body;
    db.query(`INSERT INTO user_files (userHandle, file_path) VALUES ($1, $2) RETURNING *;`,[userHandle,`${req.user}/${parentPath+'/'+folderName}`],(err,result)=>{
        if(!err){
            return res.status(500).json({message:"Internal Server Error"})
        }

    })
    s3.putObject({
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:`${req.user}/${parentPath+'/'+folderName}`,
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
    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }

    s3.upload({
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:`${req.user}/${path}`,
        Body:req.files.file.data
    }).then((data)=>{
        res.status(200).json({message:`${data.location}`})
    }).catch(err=>{
        console.log(err)
        res.status(400).json({messag:err})
    })
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


module.exports=router