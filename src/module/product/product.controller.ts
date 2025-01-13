import { Router, Request, Response } from "express";
import response from "../../utils/response.api";
import ProductService from "./product.service";
import { iGetProduct, iProduct, iUpdateProduct } from "../../types/product";
import { productSchema, getProductSchema } from "../../types/product";
import { v2 as cloudinary } from 'cloudinary';
import multer from "multer";
import sharp from "sharp";
import streamifier from 'streamifier';
import dotenv from 'dotenv';

dotenv.config();

const product: Router = Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
  });
  
  const upload = multer({ storage: multer.memoryStorage() });



product.get("/products", async (req: Request, res: Response) => {


    const productData: iGetProduct = Object.fromEntries(
        Object.entries(req.query).map(([key, value]) => {
            switch (key) {
                case "name":
                case "category":
                    return [key, value as string];
                case "priceMin":
                case "priceMax":
                    return [key, Number(value)];
                case "discount":
                    return [key, Boolean(value)];
                default:
                    return [];
            }
        })
    ) as iGetProduct;

    const validateData = getProductSchema.safeParse(productData);

    if (!validateData.success) {
        return response(res, 400, "Validation Error", validateData.error.errors);
    }

    try {
        const product = await ProductService.getProduct(productData);
        return response(res, 200, "Success", null, product);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Getting Product", error.message);
    }
});


product.get("/product/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const product = await ProductService.getProduct({id : id});
        return response(res, 200, "Success", null, product);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Getting Product", error.message);
    }
});

product.post("/product",upload.single('image'), async (req: Request, res: Response) => {

    if (!req.file) {
        return response(res, 400, "Bad Request", "need image product");
      }
    
      try {

        const compressedImage = await sharp(req.file.buffer).jpeg({ quality: 80 }).toBuffer();
    

        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({
            folder: "products",
            format: "jpeg",
            resource_type: "image"
          }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
    
          streamifier.createReadStream(compressedImage).pipe(uploadStream);
        });
    
        const image = (uploadResult as any).secure_url;

        const productData : iProduct = {
            name : req.body.name as string,
            category : req.body.category,
            description : req.body.description as string,
            price : Number(req.body.price),
            image : image,
            stock : Number(req.body.stock),
            discount : Number(req.body.discount)
        }

        const validateData = productSchema.safeParse(productData);

        if (!validateData.success) {
            return response(res, 400, "Validation Error", validateData.error.errors);
          }

        const newProduct = await ProductService.createProduct(productData);

        return response(res, 200, "Success", null, newProduct);

    } catch (error :any) {
        return response(res, error.status || 400, "Error add new Product", error.message);
    }
})


product.put("/product/:id", upload.single('image'), async (req: Request, res: Response) => {
    const id = req.params.id;

    const productData: iUpdateProduct = {};
    if (!req.file) {


        if (req.body.name) productData.name = req.body.name as string;
        if (req.body.category) productData.category = req.body.category;
        if (req.body.description) productData.description = req.body.description as string;
        if (req.body.price) productData.price = typeof req.body.price === 'string' ? Number(req.body.price) : req.body.price;
        if (req.body.stock) productData.stock = typeof req.body.stock === 'string' ? Number(req.body.stock) : req.body.stock;
        if (req.body.discount) productData.discount = typeof req.body.discount === 'string' ? Number(req.body.discount) : req.body.discount;
        
    
    } else {

            const compressedImage = await sharp(req.file.buffer).jpeg({ quality: 80 }).toBuffer();
        
    
            const uploadResult = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream({
                folder: "products",
                format: "jpeg",
                resource_type: "image"
              }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
              });
        
              streamifier.createReadStream(compressedImage).pipe(uploadStream);
            });
        
            const image = (uploadResult as any).secure_url;

            if (req.body.name) productData.name = req.body.name as string;
            if (req.body.category) productData.category = req.body.category;
            if (req.body.description) productData.description = req.body.description as string;
            if (req.body.price) productData.price = Number(req.body.price);
            if (image) productData.image = image
            if (req.body.stock) productData.stock = Number(req.body.stock);
            if (req.body.discount) productData.discount = Number(req.body.discount);
   
    }

    try {
        const product = await ProductService.updateProduct(id as string, productData);
        return response(res, 200, "Success", null, product);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Updating Product", error.message);
    }
})


product.delete("/product/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const product = await ProductService.deleteProduct(id as string);
        return response(res, 200, "Success", null, product);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Deleting Product", error.message);
    }
})



export default product