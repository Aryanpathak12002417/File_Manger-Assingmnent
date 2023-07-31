module.exports=(req,res,next)=>{
    req.user='Aryan'
    next();
}