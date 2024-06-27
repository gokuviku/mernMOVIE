import jwt from 'jsonwebtoken'
import User from '../models/User'
import asyncHandler from '../middlewares/asyncHandler.js'


const authenticate = asyncHandler(async(req,res,next)=>{
  let token;

  token = req.cookies.jwt
  if(token){
    try {
      const decoded = jwt.veryfy(token,process.env.JWT_SECRET)
      req.user = await User.findById(decoded.userId).select('-password')
      next();
      
    } catch (error) {
      res.status(401)
      throw new Error("Not authorized , token failed")
    }
  }
  else{
    res.status(401)
      throw new Error("Not authorized , no token")
  }
})

const authorizeAdmin = (req,res,next)=>{
  if(req.user && req.isAdmin){
    next()
  }else{
    res.status(401).send("Not authorized as an Admin")
  }
}

export {authenticate,authorizeAdmin}