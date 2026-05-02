import { prisma } from "../config/prisma.js";

export const productRepository = {
  create(data) {
    return prisma.product.create({ data });
  },

  findActiveByName(name, ignoredId = undefined) {
    return prisma.product.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive"
        },
        status: "ATIVO",
        ...(ignoredId ? { NOT: { id: ignoredId } } : {})
      }
    });
  },

  findById(id) {
    return prisma.product.findUnique({
      where: { id }
    });
  },

  async list({ where, orderBy, skip, take }) {
    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take
      }),
      prisma.product.count({ where })
    ]);

    return { items, total };
  },

  updateWithHistory({ id, data, history }) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data
      });

      await tx.productHistory.create({
        data: history
      });

      return product;
    });
  }
};
