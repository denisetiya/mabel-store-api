import express from "express";
import auth from "./module/auth/auth.controller";
import product from "./module/product/product.controller";

const url = express();

url.use("/", auth);
url.use("/", product);

export default url