import { Router, Request, Response } from "express";
import { addCartSchema } from "../../types/cart";
import { iAddCart } from "../../types/cart";
import CartService from "./cart.service";

const cart: Router = Router();

cart.post("/cart", async (req: Request, res: Response) => {
    const { userId, productId, quantity } = addCartSchema.parse(req.body);
    const cartData: iAddCart = {
        userId,
        productId,
        quantity
    };
    try {
        const cart = await CartService.addCart(cartData);
        return res.status(200).json({
            message: "Success",
            data: cart,
        });
    } catch (error: any) {
        return res.status(error.status || 400).json({
            message: error.message,
        });
    }
});


cart.get("/cart/:userId", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const cart = await CartService.getCart(userId as string);
        return res.status(200).json({
            message: "Success",
            data: cart,
        });
    } catch (error: any) {
        return res.status(error.status || 400).json({
            message: error.message,
        });
    }
});

cart.delete("/cart/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const cart = await CartService.deleteCart(id as string);
        return res.status(200).json({
            message: "Success",
            data: cart,
        });
    } catch (error: any) {
        return res.status(error.status || 400).json({
            message: error.message,
        });
    }
});