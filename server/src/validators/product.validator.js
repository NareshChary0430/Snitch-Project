import {body,validationResult} from "express-validator";



export const createProductValidator = [

    body("title")
        .exists().withMessage("Title is required").bail()
        .isString().withMessage("Title must be a string").bail()
        .trim()
        .isLength({min: 2,max:100}).withMessage("Title must be at least 2 characters long").bail()
        .isAlpha("en-US",{ignore: " "}).withMessage("Title must contain only alphabets"),

    body("description")
        .exists().withMessage("Description is required").bail()
        .isString().withMessage("Description must be a string").bail()
        .trim()
        .isLength({min: 20,max:500}).withMessage("Description must be at least 20 characters long"),

    body("price.amount")
        .exists().withMessage("Price is required").bail()
        .isFloat({min: 0}).withMessage("Price must be a floating number and greater than 0").bail(),
    

    body("price.currency")
        .exists().withMessage("Currency is required").bail()
        .isString().withMessage("Currency must be a string").bail()
        .isIn(["INR","USD"]).withMessage("Currency must be either INR or USD"),


    body("sizes")
        .exists().withMessage("Sizes are required").bail()
        .isArray({min: 1}).withMessage("Sizes must be an array and must contain at least one size").bail(),

    body("sizes.*.size")
        .exists().withMessage("Size is required").bail()
        .isString().withMessage("Size must be a string")
        .trim()
        .isIn(["XS","S","M","L","XL","XXL"]).withMessage("Size must be one of XS,S,M,L,XL,XXL").bail(),

    body("sizes.*.stock")
        .exists().withMessage("Stock is required").bail()
        .isInt({min: 0}).withMessage("Stock must be an integer and greater than or equal to 0").bail(),


    
    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                message: "Validation failed",
                errors: errors.array(),
            });
        }
        next();
    }



]