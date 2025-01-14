import prisma from "../../config/prisma.config";
import isError from "../../utils/handle.error";
import { iAddCart } from "../../types/cart";



export default class CartService {
    static async getCart( userId : string) {
        try {
            const cart = await prisma.user.findUnique({
                where : {
                    id : userId
                    
                }, include : {
                    carts : {
                        include : {
                            product : {
                                select : {
                                    id : true,
                                    name : true,
                                    category : true,
                                    price : true,
                                    stock : true,
                                    discount : true
                                }
                            }
                        },
                        select : {
                            id : true,
                            quantity : true,
                            productId : true
                        }
                    }
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
            const cartAvalaible = await prisma.cartUser.findUnique({
                where : {
                    userId : cartData.userId,
                    productId : cartData.productId
                }
            })

            if (cartAvalaible) {
                const cart = await prisma.cartUser.update({
                    where : {
                        id : cartAvalaible.id
                    },
                    data : {
                        quantity : cartAvalaible.quantity + cartData.quantity
                    }
                })
                return cart
            } else {
                const cart = await prisma.cartUser.create({
                    data : cartData
                })
                return cart
            }    

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