import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async(req,res,next)=>{     // next is for middleware

const {username,email,password} = req.body;
const hashedPassword= bcryptjs.hashSync(password,10);
const newUser = new User({username , email , password:hashedPassword}); // for bcrypt the password
try{
    await newUser.save();
 res.status(201).json("user created Succesfully")
} catch(error){
    next(error);
} 
};

export const signin = async(req,res,next)=>{
   const {email,password} = req.body;
   try {
    const validUser = await User.findOne({email});  // finOne in mongodb to find email testing of email
    if(!validUser) return next(errorHandler(404,'User not found'));
    const validPassword = bcryptjs.compareSync(password, validUser.password); // thorugh bcryptjs package 
    if(!validPassword) return next(errorHandler(401,'Wrong Credentials!')); // testing password

    const token = jwt.sign({ id:validUser._id},process.env.JWT_SECRET) // sign a token JWT 
    const {password : pass, ...rest} = validUser._doc;   // not sending password through postman
    res.cookie('access_token',token,{httpOnly: true}).status(200).json(rest); // token is saved inside cookie

    
   } catch (error) {
     next(error);
   }

};

export const google = async (req,res,next)=>{
    try {
        const user = await User.findOne({email: req.body.email}) // yaha check krega ki hai bhi ki nhiii
        if(user){ // checking user if exist or not
             const token =jwt.sign({ id :user._id},process.env.JWT_SECRET); // token for registering
             const {password: pass, ...rest } = user._doc;
             res
             .cookie('access_token',token,{httpOnly:true}) // cookie 
             .status(200)
             .json(rest);
        }
        else{ // password generate kiya hai kyuki signin krte time password nhi mang raha google isliye ider create kr rahe h

            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword =  bcryptjs.hashSync(generatedPassword,10); // hashing the password by bcryptjs
            const newUser= new User ({username:req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) , email:req.body.email, password: hashedPassword, avatar: req.body.photo });
            await newUser.save(); //ider phele save kr liye 
            const token= jwt.sign({id: newUser._id},process.env.JWT_SECRET); // phir whi token generate kiya
            const {password: pass, ...rest }= newUser._doc;
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);

        }
    } catch (error) {
        next(error)
    }
}

export const signOut = async(req,res,next)=>{
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
    } catch (error) {
        next(error);
    }
}



