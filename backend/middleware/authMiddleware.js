import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

// Protect routes / User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
    //Let's initialize the variable token
    let token;

    // To Read the 'jwt' from the cookie
    token = req.cookies.jwt;

    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //Let's get user from token  by id
            req.user = await User.findById(decoded.userId).select('-password');

            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error("Non autorisé, le token a échoué");
        }
    }else{
        res.status(401);
        throw new Error("Non autorisé, pas de token");
    }
});


// Admin middleware / User must be an admin
const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401);
        throw new Error("Non autorisé comme admin");
    }
};

export {
   protect,
   admin
}