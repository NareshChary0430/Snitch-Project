import {Router} from 'express';
import {createProductValidator,unListProductValidator,listProductValidator} from "../validators/product.validator.js";
import {authenticate,authenticateSeller} from "../middlewares/auth.middleware.js";
import {createProduct,listAllProducts,unListProduct,listProduct} from "../controller/product.controller.js";

import multer from 'multer';

const upload = multer({storage: multer.memoryStorage(),
    limits: {
        files: 5, // Maximum number of files
        fileSize: 5 * 1024 * 1024, // 5 MB
    },

});

const router = Router();

/* * @POST /api/products
 * @description creates the products and save its data into the database and image will store in imagekit
 * @access to seller only
 * @param req Express req
 * @param req.body = {title,description,images,price,sizes}
 * @param req.user Object
 * @param req.user.userId String
 * @param res Express res
 * @returns {Object} Object containing product data
 * 
 */


router.post("/",authenticate,
    
    // upload.array("images", 5) middleware is used to handle the file upload. It allows up to 5 images to be uploaded at once. The images will be stored in memory as buffers, which can then be processed or uploaded to a storage service like ImageKit.
    upload.array("images"),
    
    // This middleware checks if the authenticated user has the role of "seller". If not, it returns a 403 Forbidden response. If the user is a seller, it calls next() to proceed to the next middleware or route handler.
    authenticateSeller,

    // This middleware parses the price and sizes fields from the request body, which are expected to be JSON strings. It converts them into JavaScript objects so that they can be easily used in the subsequent middleware or route handler.

    (req,res,next) => {
        req.body?.price && (req.body.price = JSON.parse(req.body.price));
        req.body?.sizes && (req.body.sizes = JSON.parse(req.body.sizes));
        next();
    },
    

    // This middleware validates the request body against the defined schema for creating a product. If the validation fails, it returns a 400 Bad Request response with the validation error message. If the validation passes, it calls next() to proceed to the next middleware or route handler.
    createProductValidator,

    createProduct




)





/**
 * @GET 
 * @ROUTE /api/products
 * @description get all products from the database
 * @param req Express req
 * @param res Express res
 * @returns {Object} Object containing all products data
 * 
 */



router.get("/",authenticate,listAllProducts)




/**
 * @PATCH /api/products/:id
 * @description update the product data in the database
 * @access to seller only
 */ 




router.patch("/unlist/:id",authenticate,authenticateSeller,unListProductValidator,unListProduct);

router.patch("/list/:id",authenticate,authenticateSeller,listProductValidator,listProduct);

export default router;