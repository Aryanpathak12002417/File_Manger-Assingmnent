const {Pool}=require('pg')

const pool=new Pool({
    user:process.env.PG_ADMIN_USER,
    host:process.env.PG_ADMIN_HOST,
    database:process.env.PG_ADMIN_DATABASE,
    password:process.env.PG_ADMIN_PASSWORD

})

module.exports=pool