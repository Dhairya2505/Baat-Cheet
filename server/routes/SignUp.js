import User from "../database/MONGO_database.js";
import { hash } from "bcrypt";
import jwt from 'jsonwebtoken';

import APIResponse from './../utils/APIResponse.js';

import { Router } from "express";
import UserDuplicacy from "../middlewares/UserDuplicacy.js";

import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const SignUpRoute = Router();

SignUpRoute.post('/', UserDuplicacy, async (req,res) => {

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    
    const hashedPassword = await hash(password,10);
    
    const user = await new User({
        userName : username,
        email : email,
        Password : hashedPassword
    })
    user.save();

    const token = await jwt.sign({
        username : username,
    },SECRET_KEY);

    res.cookie('BCC', `Bearer ${token}`);
    res.json(
        new APIResponse(200,"User created successfully")
    )

})