import prisma from "../../config/prisma.config";
import isError from "../../utils/handle.error";
import { iAddCart } from "../../types/cart";



export default class CartService {
    static async getCart( userId : string) {
        try {
            const cart = await prisma.cartUser.findMany({
                where : {
                    userId : userId
                }, include : {
                    product : true
                }
            })
            return cart
        } catch (error: unknown) {
            console.log(error)
            isError(error)
        }        
    }

    static async addCart(cartData : iAddCart) {
        try {
            const cart = await prisma.cartUser.create({
                data : cartData
            })
            return cart

        } catch (error: unknown) {
            console.log(error)
            isError(error)
        }   

    }

    static async deleteCart(id : string) {
        try {
            const cart = await prisma.cartUser.delete({
                where : {
                    id : id
                }
            })
            return cart
        } catch (error: unknown) {
            console.log(error)
            isError(error)
        }   
    }
    

}