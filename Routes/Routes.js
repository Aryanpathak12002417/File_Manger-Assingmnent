const express=require('express')
const router=express.Router()
const user=require('../Controller/User')
const fileManagment=require('../Controller/FileMangment')

router.use('/user',user);
router.use('/file',fileManagment);



module.exports=router
