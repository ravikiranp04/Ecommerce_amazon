const jwt=require("jsonwebtoken")
require('dotenv').config()

const verifyToken=(req,res,next)=>{
    //get bearer token
    let bearerToken=req.headers.authorization;
    if(!bearerToken){
        return res.send({message:"Unauthorized access..Plz Login"})

    }
    let token=bearerToken.split(' ')[1];
    try{
        let decodedToken=  jwt.verify(token,process.env.SECRET_KEY)
        next()
    }catch(err){
        next(err);
    }
   
}
module.exports={verifyToken}