import jwt from 'jsonwebtoken';
import user from '../models/User.js';

export const protectRoute = async (req, res, next) => {
  try{
    const token = req.cookies.token;
    if(!token){
      return res.status(401).json({sucess: false, message: "Not authorized"});
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
      return res.status(401).json({sucess: false, message: "Token Not authorized"});
    }
    const existUser = await user.findById(decoded.userId).select('-password'); 
    if(!existUser){
      return res.status(401).json({sucess: false, message: "User not found"});
    }
    req.user = existUser;
    next();
  }
  catch(error){
    console.log("Auth Middleware Error: "+error.message);
    return res.status(401).json({sucess: false, message: "Not authorized"});
  }
}

