import user from "../models/User.js";
import jwt from "jsonwebtoken";
import {upsertStreamUser} from "../config/stream.js";
export const signup =  async (req, res) => {
  const {email, password, fullname} = req.body;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  try {
    if(!email || !password || !fullname){
      return res.status(400).send('Please add all fields');
    }  
    if(password.length < 6){
      return res.status(400).send('Password must be at least 6 characters');
    }
    if(!emailRegex.test(email)){
      return res.status(400).send('Please enter a valid email');
    }
    
    const userExist = await user.findOne({email});
    if(userExist){
      return res.status(400).send('Email already exists');
    }
    const idx = Math.floor(Math.random()* 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    const newUser = await user.create({
      email,
      password,
      fullname,
      profilePic: randomAvatar
    })

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullname,
        image: newUser.profilePic || ""
      });
      console.log(`Stream user ${newUser._id} created`);
    } catch (error) {
      console.log("Error:",error.message);
    }

    const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, { expiresIn: '7d'});
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    })
    res.status(201).json({sucess: true, user: newUser})
    
  } catch (error) {
    console.log("Error:",error.message);
    res.status(500).send(error.message);
  }
}


export const login = async(req, res) => {
  try {
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).send('Please add all fields');
    }
    const userExist = await user.findOne({email});
    if(!userExist){
      return res.status(400).send('User does not exist');
    }
    const isMatch = await userExist.matchPassword(password);

    if(!isMatch){
      return res.status(400).send('Invalid Credentials');
    }

    const token = jwt.sign({userId: userExist._id}, process.env.JWT_SECRET, { expiresIn: '7d'});
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    })
    res.status(200).json({sucess: true, user: userExist})


    
  } catch (error) {
    
    console.log("Error:",error.message);
    res.status(500).send(error.message);
  }
}   

export const logout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({sucess: true})
}

export const onboard = async (req, res) => {
  try {
    const userID = req.user._id; 
    const {fullname, bio, nativeLanguage, learningLanguage, location, profilePic} = req.body;

    if(!fullname || !bio || !nativeLanguage || !learningLanguage || !location){
      return res.status(400).send(
        { message: "Please add all fields",
          missingFields: [!fullname && "fullname", !bio && "bio", !nativeLanguage &&  "nativeLanguage", ! learningLanguage && "learningLanguage", !location && "location"].filter(Boolean)
        }
      );
    }

    const updatedUser =  await user.findByIdAndUpdate(userID, {
      fullname,
      bio,
      nativeLanguage,
      learningLanguage,
      location,
      isOnboarded: true
    }, {new: true});

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullname,
        image: updatedUser.profilePic || "",
      })
    } catch (error) {
      
    }


    res.status(200).json({sucess: true, updatedUser: updatedUser})

  } catch (error) {
    console.log("Onboard Error:",error.message);
    return res.status(500).send(error.message);
  }

}