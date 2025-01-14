import prisma from "../../config/prisma.config";
import isError from "../../utils/handle.error";
import { iAddReview, iUpdateReview } from "../../types/review";


export default class ReviewService {
    static async addReview(reviewData : iAddReview) {
        try {
            const review = await prisma.review.create({
                data : reviewData
            })
            return review
        } catch (error) {
            console.log(error)
            isError(error)
        }
    }

    static async deleteReview(id : string) {
        try {
            const review = await prisma.review.delete({
                where : {
                    id : id
                }
            })
            return review
        } catch (error) {
            console.log(error)
            isError(error)
        }
    }

    static async getReview(productId : string) {
        try {
            const review = await prisma.review.findMany({
                where : {
                    productId : productId
                }
            })
            return review
        } catch (error) {
            console.log(error)
            isError(error)
        }
    }

    static async updateReview(id : string, reviewData : iUpdateReview) {
        try {
            const review = await prisma.review.update({
                where : {
                    id : id
                },
                data : reviewData
            })
            return review
        } catch (error) {
            console.log(error)
            isError(error)
        }
    }

}