import APIError from '../utils/APIError.js';
import User from './../database/MONGO_database.js'
import { compare } from 'bcrypt';

const CheckUser = async (req,res,next) => {

    const username = req.headers.username;
    const password = req.headers.password;

    const user = await User.findOne({
        userName : username
    })

    if(user){
        const hashedPassword = user.Password;
        if( await compare(password,hashedPassword)){
            next();
        }
        else{
            res.json(
                new APIError(401,"Incorrect password")
            )
        }
    }
    else{
        res.json(
            new APIError(401,"User not found")
        )
    }

}

export default CheckUser;