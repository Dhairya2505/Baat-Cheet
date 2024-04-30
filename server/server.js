import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cors({
    origin : `${FRONTEND_URI}`,
    credentials : true   
}))
app.use(cookieParser());



const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
})