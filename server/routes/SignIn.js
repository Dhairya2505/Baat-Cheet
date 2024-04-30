import { Router } from "express";
import CheckUser from "../middlewares/CheckUser.js";
import jwt from 'jsonwebtoken';
import APIResponse from "../utils/APIResponse.js";

import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const SignInRoute = Router();

SignInRoute.get('/', CheckUser, async (req,res) => {
    
    const username = req.headers.username;

    const token = await jwt.sign({
        username : username,
    },SECRET_KEY);

    res.cookie('BCC', `Bearer ${token}`);
    
    res.json(
        new APIResponse(200,"User signed in")
    )

})

export default SignInRoute;