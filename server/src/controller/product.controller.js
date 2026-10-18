import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";



export async function createProduct(req,res){

  const fileUrls = []

  for(let i = 0;i<req.files.length;i++){

    const response = await uploadFile(
        {
            buffer : req.files[i].buffer,
            fileName : req.files[i].originalname
        }
    )

    console.log("response from imagekit",response)
    fileUrls.push(response.url)

  }


  const product = new productModel.create({
    title : req.body.title,
    description : req.body.description,
    images : fileUrls,
    price : {
        amount : req.body.price.amount,
        currency : req.body.price.currency
    },  
    sizes : req.body.sizes,
    seller : req.user.userId
  })

  await product.save()


  return res.status(201).json({
    message : "Product created successfully",
    data : {
        product
    }
  })



}




export async function listAllProducts(req,res){

    const products = await productModel.find()

    return res.status(200).json({
        message : "Products fetched successfully",
        data : {
            products
        }
    })

}