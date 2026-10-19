import {readAccessToken} from "../utils/auth.utils.js";

export function authenticate(req, res, next) {

    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
        return res.status(401).json({
            message: "Access token is missing",
        });
    }

    try{

        const decoded = readAccessToken(accessToken);

        req.user = decoded;

        next();

    }catch(err){
        return res.status(401).json({
            message: "Invalid or expired access token",
        });
    }

}




export function  authenticateSeller(req,res,next){
    if(req.user.role !== "seller"){
        return res.status(403).json({
            message : "You are not authorized to create a product",
        });
    }
        next();
    }