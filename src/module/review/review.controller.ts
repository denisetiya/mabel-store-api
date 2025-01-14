import { Router, Request, Response } from "express";
import response from "../../utils/response.api";
import ReviewService from "./review.service";
import { iAddReview, iUpdateReview } from "../../types/review";
import { addReviewSchema, updateReviewSchema } from "../../types/review";

const review: Router = Router();



review.post("/review", async (req: Request, res: Response) => {
    const reviewData : iAddReview = req.body;

    const validateData = addReviewSchema.safeParse(reviewData);

    if (!validateData.success) {
        return response(res, 400, "Validation Error", validateData.error.errors);
    }

    try {
        const review = await ReviewService.addReview(reviewData);
        return response(res, 200, "Success", review);

    } catch (error: any) {
        return response(res, error.status || 400, error.message);
    }
});


review.delete("/review/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const review = await ReviewService.deleteReview(id as string);
        return response(res, 200, "Success", null, review);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Deleting Review", error.message);
    }
})


review.get("/review/:productId", async (req: Request, res: Response) => {
    const productId = req.params.productId;
    try {
        const review = await ReviewService.getReview(productId as string);
        return response(res, 200, "Success", null, review);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Getting Review", error.message);
    }
})

review.put("/review/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const reviewData : iUpdateReview = req.body;

    const validateData = updateReviewSchema.safeParse(reviewData);

    if (!validateData.success) {
        return response(res, 400, "Validation Error", validateData.error.errors);
    }

    try {
        const review = await ReviewService.updateReview(id as string, reviewData);
        return response(res, 200, "Success", null, review);
    
    } catch (error :any) {
        return response(res, error.status || 400, "Error Updating Review", error.message);
    }
})


export default review