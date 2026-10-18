import {Router} from 'express';
import {addToCartValidator} from "../validators/cart.validator.js";
import {authenticate} from "../middlewares/auth.middleware.js";

const router = Router();


/**
 * @Method POST
 * @Route /api/cart/
 * @Access protected
 * @description This route is used to add a product to the cart. If the product already exists in the cart, it will update the quantity of the product in the cart.
 * @param req Express req
 * @param req.body = {productId,quantity,size}
 */ 


// req.body = {productId,quantity,size} is the request body that contains the productId, quantity and size of the product to be added to the cart. The productId is the id of the product that is to be added to the cart. The quantity is the number of products to be added to the cart. The size is the size of the product to be added to the cart.
router.post("/", addToCartValidator,authenticate)




export default router;

