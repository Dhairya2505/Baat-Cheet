import APIError from './../utils/APIError.js';
import User from './../database/MONGO_database.js';

const UserDuplicacy = async (req,res,next) => {
    
    const username = req.body.username;
    const email = req.body.email;

    const user = await User.findOne({
        userName : username
    });

    const user1 = await User.findOne({
        email : email
    })

    const user2 = await User.findOne({
        userName : username,
        email : email
    })

    if(user2){
        res.json(
            new APIError(409,"User already registered")
        )
    }
    else if(user){
        res.json(
            new APIError(409,"Username taken")
        )
    }
    else if(user1){
        res.json(
            new APIError(409,"Email taken")
        )
    }
    else{
        next();
    }

}

export default UserDuplicacy;