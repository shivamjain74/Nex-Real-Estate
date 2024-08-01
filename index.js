import express from 'express';
const app = express();
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './api/routes/user.route.js';
import authRouter from './api/routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './api/routes/listing.route.js';
import cors from 'cors';

dotenv.config();





app.use(cookieParser());  // to get the infor from the cookie

app.use(cors({
    // origin: 'http://localhost:5173',
    origin:'https://nex-estate-frontend.vercel.app',
    credentials: true,
}));


app.use(express.json()); // to use any json file as a input to server otherwise get undefined 

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to MongoDB!');
}).catch((err)=>{
    console.log(err);
});


app.use((req, res, next) => {
    // Set Cross-Origin Opener Policy (COOP)
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

    // Set Cross-Origin Embedder Policy (COEP)
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

    // Call the next middleware in the chain
next();
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000!");
});

// all the routers are in index.js 
app.use("/api/user",userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);


app.use((err,req,res,next)=>{   // middleware
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server error';
    return res.status(statusCode).json({    // error handling through middleware
        success:false,
        statusCode,
        message,
    })

})

