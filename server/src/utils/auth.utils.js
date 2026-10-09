import jwt from "jsonwebtoken";
import config from "../config/config.js";


export function createAccessToken({userId,role}){
    const accessToken = jwt.sign(
        {
            userId,
            role
        },
        config.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
    return accessToken;
}


export function createRefreshToken({userId,role}){
    const refreshToken = jwt.sign(
        {
            userId,
            role
        },
        config.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
    return refreshToken;
}





