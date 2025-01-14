import {z} from "zod";

const addReviewSchema = z.object({
    userId : z.string(),
    productId : z.string(),
    rating : z.number().max(5, "Rating must be between 1 and 5"),
    comment : z.string(),
    productImage : z.string().optional()
})


const updateReviewSchema = z.object({
    rating : z.number().max(5, "Rating must be between 1 and 5").optional(),
    comment : z.string().optional(),
    productImage : z.string().optional()
})



type iAddReview = z.infer<typeof addReviewSchema>
type iUpdateReview = z.infer<typeof updateReviewSchema>


export {addReviewSchema, updateReviewSchema}
export type {iAddReview, iUpdateReview}