import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  // next is for middleware

  const { username, email, password } = req.body; // req.body is the information we get from the browser
  const hashedPassword = bcryptjs.hashSync(password, 10); // for bcrypt the password , 10 is the salt  for encrypted
  const newUser = new User({ username, email, password: hashedPassword }); // User model is created in models(Schema) is used to save three fields
  try {
    await newUser.save(); // saving inside database,await plus async is to stay on this line until operation is finished as takes time to save the user
    res.status(201).json("user created Succesfully"); //201 means something is created
  } catch (error) {
    // send error to user
    next(error); // in indexjs
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body; // data from req.body
  try {
    const validUser = await User.findOne({ email }); // finOne in mongodb to find email testing of email
    if (!validUser) return next(errorHandler(404, "User not found")); // custom error
    const validPassword = bcryptjs.compareSync(password, validUser.password); // thorugh bcryptjs package checking the password thorugh comparesync method
    if (!validPassword) return next(errorHandler(401, "Wrong Credentials!")); // testing password

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: 3 * 24 * 60 * 60,
    }); // sign a token JWT
    const { password: pass, ...rest } = validUser._doc;
    console.log(validUser._doc); // not sending password through postman, destructure
    const responseData = { ...rest, token:token};
    console.log(responseData)
    res
    //   .json("access_token", token, {
    //     httpOnly: true, // Prevents client-side scripts from accessing the cookie
    //     secure: process.env.NODE_ENV === "production", // Send over HTTPS in production
    //     sameSite: "None", // Allows the cookie to be sent with cross-site requests
    //   })
    //   .status(200)
      .json(responseData).status(200); // token is saved inside cookie
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }); // yaha check krega ki hai bhi ki nhiii
    if (user) {
      // checking user if exist or not
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // token for registering
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true }) // cookie
        .status(200)
        .json(rest);
    } else {
      // password generate kiya hai kyuki signin krte time password nhi mang raha google isliye ider create kr rahe h

      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10); // hashing the password by bcryptjs
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save(); //ider phele save kr liye
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET); // phir whi token generate kiya
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
