import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { SignUpRoute } from './routes/SignUp.js';
import SignInRoute from './routes/SignIn.js';

import dotenv from 'dotenv';
import { FRONTEND_URI } from './constants.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cors({
    origin : `${FRONTEND_URI}`,
    credentials : true   
}))
app.use(cookieParser());

app.use('/signup',SignUpRoute);
app.use('/signin',SignInRoute);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
})