import jwt from 'jsonwebtoken';
import { apiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';

export const verifyJWT = asyncHandler(async (req, _ , next) => { // _ instead of res , becz in this code res is not used so _ can be used 
    try {
        const token =
            req.cookies?.accessToken ||
            req.header('Authorization')?.replace('Bearer ', ''); // after the || the header and all is used if there are no cookies , for example in phone or mible applcation headers are passed
    
        if (!token) throw new apiError(401, 'Unauthorized request ');
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select(
            '-password -refreshToken'
        );
        if (!user) throw new apiError(401, 'invalid acces token ');
    
        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401,error?.message || "invalid acces token ")
    }
});
