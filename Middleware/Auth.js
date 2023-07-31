const jwt=require('jsonwebtoken');
module.exports =(req,res,next)=>{

    try{
        
        const token=req.cookies.token;
        const verify=jwt.verify(token)
        if(!verify){
            return res.status(200).json({'messge':"Please Login To Access Platform"})
        }
        req.user=verify.user;
        console.log(user)
        next();
    }
    catch(err){
        console.log('Not Authorized to use the services')
        return res.status(200).json({'messge':"Please Login To Access Platform"})
    }

}