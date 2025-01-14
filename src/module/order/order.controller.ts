import { Router, Request, Response } from "express";
import response from "../../utils/response.api";
import OrderService from "./order.service";
import { iAddOrder} from "../../types/order";
import { addOrderSchema} from "../../types/order";


const order: Router = Router();

order.post("/order", async (req: Request, res: Response) => {
    const orderData : iAddOrder = req.body;

    const validateData = addOrderSchema.safeParse(orderData);

    if (!validateData.success) {
        return response(res, 400, "Validation Error", validateData.error.errors);
    }

    try {
        const order = await OrderService.addOrder(orderData);
        return response(res, 200, "Success", order);

    } catch (error: any) {
        return response(res, error.status || 400, error.message);
    }
});


order.get("/order/:userId", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const order = await OrderService.getOrder(userId as string);
        return response(res, 200, "Success", null, order);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Getting Order", error.message);
    }
})

order.delete("/order/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const order = await OrderService.deleteOrder(id as string);
        return response(res, 200, "Success", null, order);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Deleting Order", error.message);
    }
})

export default order