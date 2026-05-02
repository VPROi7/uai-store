import { Prisma } from "@prisma/client";

import { prisma } from "../config/prisma.js";

export const stockMovementRepository = {
  async createMovement({ productId, type, quantity, reason, userId }) {
    return prisma.$transaction(
      async (tx) => {
        const [product] = await tx.$queryRaw`
          SELECT * FROM products WHERE id = ${productId} FOR UPDATE
        `;

        if (!product) {
          return { product: null, movement: null };
        }

        if (product.status === "INATIVO") {
          return {
            product: normalizeRawProduct(product),
            movement: null,
            inactiveProduct: true
          };
        }

        const currentStock = product.stock_quantity;
        const nextStock = type === "ENTRADA" ? currentStock + quantity : currentStock - quantity;

        if (nextStock < 0) {
          return {
            product: normalizeRawProduct(product),
            movement: null,
            insufficientStock: true
          };
        }

        const updatedProduct = await tx.product.update({
          where: { id: productId },
          data: { stockQuantity: nextStock }
        });

        const movement = await tx.stockMovement.create({
          data: {
            productId,
            userId,
            type,
            quantity,
            reason
          },
          include: {
            product: true,
            user: true
          }
        });

        return {
          product: updatedProduct,
          movement,
          insufficientStock: false
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable
      }
    );
  },

  async list({ where, skip, take }) {
    const [items, total] = await prisma.$transaction([
      prisma.stockMovement.findMany({
        where,
        include: {
          product: true,
          user: true
        },
        orderBy: { createdAt: "desc" },
        skip,
        take
      }),
      prisma.stockMovement.count({ where })
    ]);

    return { items, total };
  }
};

function normalizeRawProduct(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    stockQuantity: product.stock_quantity,
    minimumStock: product.minimum_stock,
    status: product.status,
    createdAt: product.created_at,
    updatedAt: product.updated_at
  };
}
