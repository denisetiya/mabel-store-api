import {z} from "zod";

const paymentSchema = z.object({
    method : z.string(),
    amount : z.number(),
})


const addOrderSchema = z.object({
    userId : z.string(),
    productId : z.string(),
    quantity : z.number(),
}).extend({
    payment : paymentSchema
})

type iAddOrder = z.infer<typeof addOrderSchema>

export {addOrderSchema}
export type {iAddOrder}

