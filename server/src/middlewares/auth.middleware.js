import {readAccessToken} from "../utils/auth.utils.js";

export function authenticate(req, res, next) {

    const accessToken = req.headers.Authorization?.split(" ")[1];

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