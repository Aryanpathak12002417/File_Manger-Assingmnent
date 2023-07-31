const {Pool}=require('pg')


const pool=new Pool({
    user:'',
    host:'',
    database:'',
    password:''

})

module.exports=pool