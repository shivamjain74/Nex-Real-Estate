import express from 'express';
import { google, signOut, signin, signup } from '../controllers/auth.controller.js';

const router=express.Router();

router.post("/signup",signup); // new user register
router.post("/signin",signin); // already register user
router.post("/google",google);
router.get('/signout',signOut); 


export default router;