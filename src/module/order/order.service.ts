import prisma from "../../config/prisma.config";
import isError from "../../utils/handle.error";
import { iAddOrder } from "../../types/order";

export default class OrderService {
  static async addOrder(orderData: iAddOrder) {
    try {
      const order = await prisma.order.create({
        data: {
          userId: orderData.userId,
          productId: orderData.productId,
          quantity: orderData.quantity,
          payment: {
            create: {
              method: orderData.payment.method,
              amount: orderData.payment.amount,
            },
          },
        },
      });
      return order;
    } catch (error) {
      console.log(error);
      isError(error);
    }
  }

  static async getOrder(userId: string) {
    try {
      const order = await prisma.order.findMany({
        where: {
          userId: userId,
        },
        include: {
          product: true,
          payment: true,
          delivery: true,
        },
      });
      return order;
    } catch (error) {
      console.log(error);
      isError(error);
    }
  }

  static async deleteOrder(id: string) {
    try {
      const order = await prisma.order.update({
        where: { id },
        data: {
          payment: {
            update: {
              where: {
                orderId: id,
              },
              data: {
                status: "cancelled",
              },
            },
          },
        },
      });
      return order;
    } catch (error) {
      console.log(error);
      isError(error);
    }
  }
}
