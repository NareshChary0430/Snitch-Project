import {Router} from 'express';
import {addToCartValidator} from "../validators/cart.validator.js";
import {authenticate} from "../middlewares/auth.middleware.js";
import {addToCart} from "../controller/cart.controller.js";
import {getCart} from "../controller/cart.controller.js";

const router = Router();


/**
 * @Method POST
 * @Route /api/cart/
 * @Access protected
 * @description This route is used to add a product to the cart. If the product already exists in the cart, it will update the quantity of the product in the cart.
 * @param req Express req
 * @param req.body = {productId,quantity,size}
 */ 


router.post("/", addToCartValidator,authenticate, addToCart);

router.get("/",authenticate, getCart);





export default router;

