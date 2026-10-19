import mongoose from 'mongoose';


const productSchema = new mongoose.Schema(

    {

        title: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 100,
            
        },

        description: {
            type: String,
            required: true,
            minLength: 20,
            maxLength: 500,
        },

        // url of images will be stored in the database
        images:{
            type:[
                {
                    type: String,
                }
            ],

            validate:{
                validator: images => images.length <= 5,
                message: "You can upload maximum 5 images"
            }
        },

        price:{
            amount:{
                type: Number,
                required: true,
            },
            currency:{
                type: String,
                enum: ["INR","USD"],
                default: "INR",
            }
        },

        sizes:[
            {
                size:{
                    type: String,
                    enum: ["XS","S","M","L","XL","XXL"],
                    required: true,
                },
                stock:{
                    type: Number,
                    min: 0,
                    default: 0,
                }
            }
        ],


        seller:{
            type:mongoose.Types.ObjectId,
            ref: "users",
            required: true,
        },

        isListed:{
            type: Boolean,
            default: false,
        }

    }

)


const productModel = mongoose.model("products",productSchema);

export default productModel;

/**
 * product : {
 * 
 * title : "Product title",
 * description : "Product description",
 * images : ["image1.jpg","image2.jpg"],
 * price : {
 *     amount : 100,
 *    currency : "INR"
 * }
 * sizes : [
 *    {
 *       size : "M",
 *      stock : 10
 *   }
 *      {
 *      size : "L",
 *     stock : 5
 * }
 * 
 * seller : "userId"
 *  
 * 
 * }
 */