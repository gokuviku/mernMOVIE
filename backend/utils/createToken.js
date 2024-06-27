import jwt from 'jsonwebtoken'

const generateToken = (req,userId)=>{
  const token = jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn: "30d",
  });

  res.cookie('jwt',token,{
    sameSite:"strict",
    httpOnly:true,
    maxAge:30*24*60*60*1000,
    secure:process.env.NODE_ENV !== "developement"
  });

  return token;


}

export default generateToken