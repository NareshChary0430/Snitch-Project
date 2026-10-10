import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {createAccessToken, createRefreshToken,readRefreshToken} from "../utils/auth.utils.js";


/**
 * @description register a user and save the data from req.body
 * @param req Express req
 * @param req.body Object
 * @param req.body.email String
 * @param req.body.name String
 * @param req.body.password String
 * @response res.status  = 201 (if successfull)
 */


export async function register(req,res){

    const {email,name,password} = req.body;

    const isUserAlreadyExists = await userModel.findOne({email});


    if(isUserAlreadyExists){
        return res.status(400).json({
            message : "User already exist with this email",
            errors : [{
                path : "email",
                msg : "User already exist with this email"
            }]
        });
    }

    // if user does not exist then create a new user
    const user = new userModel({
        email,
        name,
        passwordHash : await bcrypt.hash(password,10)
    });

    // create access token and refresh token for the user

    const accessToken = createAccessToken({userId : user._id, role : user.role});
    const refreshToken = createRefreshToken({userId : user._id, role : user.role});

    // save the refresh token in the cookie and also in the database

    res.cookie('refreshToken', refreshToken, {
        httpOnly : true
    });

    await userModel.findByIdAndUpdate(user._id, {refreshToken});

    user.refreshToken = refreshToken;

    // send the response to the client with the access token and user data

    res.status(201).json({
        message : "User registered successfully",
        data : {
            user:{
                email : user.email,
                name : user.name,
                id : user._id,
            }
        },
        accessToken
    })

    await user.save();


}



/**
 * @description login a user and return access token and refresh token
 * @param req.body.email String
 * @param req.body.password String
 * @param req Express req
 * @param res Express res
 * @returns {Object} Object containing access token and refresh token
 */

export async function login(req,res){

    const {email,password} = req.body;

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({
            message : "Invalid email or password",
            errors : [{
                path : "email",
                msg : "Invalid email or password"
            }]
        });
    }

    const isPasswordValid = await bcrypt.compare(password,user.passwordHash);

    if(!isPasswordValid){
        return res.status(400).json({
            message : "Invalid email or password",
            errors : [{
                path : "password",
                msg : "Invalid email or password"
            }]
        });
    }

    // create access token and refresh token for the user

    const accessToken = createAccessToken({userId : user._id, role : user.role});
    const refreshToken = createRefreshToken({userId : user._id, role : user.role});

    // save the refresh token in the cookie and also in the database

    res.cookie('refreshToken', refreshToken, {
        httpOnly : true
    });

    await userModel.findByIdAndUpdate(user._id, {refreshToken});

    user.refreshToken = refreshToken;

    // send the response to the client with the access token and user data

    res.status(200).json({
        message : "User logged in successfully",
        data : {
            user:{
                email : user.email,
                name : user.name,
                id : user._id,
            }
        },
        accessToken
    })

    await user.save();

}   


/**
 * @description refresh the access token using the refresh token
 * @param req Express req
 * @param req.cookies.refreshToken String
 * @param res Express res
 * @returns {Object} Object containing new access token and refresh token
 */



export async function refresh(req,res){

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({
            message : "Refresh token is required",
            errors : [{
                path : "refreshToken",
                msg : "Refresh token is required"
            }]
        });
    }


    try{
        const decoded = readRefreshToken(refreshToken);

        const {userId,role} = decoded;

        const user = await userModel.findById(userId);

        if(refreshToken !== user.refreshToken){
            await userModel.findByIdAndUpdate(userId, {refreshToken : null});
            return res.status(401).json({
                message : "Refresh token mismatch",
            })
        }

        const accessToken = createAccessToken({userId,role});
        
        const newRefreshToken = createRefreshToken({userId,role});

        await userModel.findByIdAndUpdate(userId, {refreshToken : newRefreshToken});

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly : true
        });

        return res.status(200).json({
            message : "Access token refreshed successfully",
            data : {
                user:{
                    email : user.email,
                    name : user.name,
                    id : user._id,
                },
                accessToken : accessToken
            }
        });

    }catch(err){
        return res.status(401).json({
            message : "Invalid refresh token",
            errors : [{
                path : "refreshToken",
                msg : "Invalid refresh token"
            }]
        });
    }
    

}   


/**
 * @description get the user data from the access token
 * @param req Express req
 * @param req.user Object
 * @param req.user.userId String
 * @param res Express res
 * @returns {Object} Object containing user data
    */



export async function getMe(req,res){

    const {userId} = req.user;
    
    const user = await userModel.findById(userId);

    if(!user){
        return res.status(404).json({
            message : "User not found",
            errors : [{
                path : "userId",
                msg : "User not found"
            }]
        });
    }

    return res.status(200).json({
        message : "User data fetched successfully",
        data : {
            user:{
                email : user.email,
                name : user.name,
                id : user._id,
            }
        }
    });

}   