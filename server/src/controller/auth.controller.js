import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {createAccessToken, createRefreshToken} from "../utils/auth.utils.js";


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
                field : "email",
                message : "User already exist with this email"
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

    await user.save();





}