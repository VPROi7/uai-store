import { ApiError } from "../errors/api-error.js";
import { productRepository } from "../repositories/product.repository.js";

export const productService = {
  async create(data) {
    const duplicatedProduct = await productRepository.findActiveByName(data.name);

    if (duplicatedProduct) {
      throw new ApiError(409, "Ja existe produto ativo com este nome.");
    }

    const product = await productRepository.create({
      name: data.name,
      category: data.category,
      price: data.price,
      stockQuantity: data.stockQuantity,
      minimumStock: data.minimumStock,
      status: "ATIVO"
    });

    return toProductResponse(product);
  },

  async list(filters, user) {
    const page = filters.page;
    const limit = filters.limit;
    const where = buildListWhere(filters, user);
    const orderBy = { [filters.orderBy]: filters.order };

    const { items, total } = await productRepository.list({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      data: items.map(toProductResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async findById(id, user) {
    const product = await productRepository.findById(id);

    if (!product || (user.role !== "ADMIN" && product.status !== "ATIVO")) {
      throw new ApiError(404, "Produto nao encontrado.");
    }

    return toProductResponse(product);
  },

  async update(id, data, user) {
    const currentProduct = await productRepository.findById(id);

    if (!currentProduct) {
      throw new ApiError(404, "Produto nao encontrado.");
    }

    const nextName = data.name ?? currentProduct.name;
    const nextStatus = data.status ?? currentProduct.status;

    if (nextStatus === "ATIVO") {
      const duplicatedProduct = await productRepository.findActiveByName(nextName, id);

      if (duplicatedProduct) {
        throw new ApiError(409, "Ja existe produto ativo com este nome.");
      }
    }

    const updateData = {
      ...data
    };

    const action =
      currentProduct.status === "ATIVO" && data.status === "INATIVO"
        ? "INATIVACAO"
        : "ATUALIZACAO";

    const product = await productRepository.updateWithHistory({
      id,
      data: updateData,
      history: {
        productId: id,
        userId: user.id,
        action,
        details: {
          before: toProductResponse(currentProduct),
          changes: updateData
        }
      }
    });

    return toProductResponse(product);
  }
};

function buildListWhere(filters, user) {
  const where = {};

  if (filters.name) {
    where.name = {
      contains: filters.name,
      mode: "insensitive"
    };
  }

  if (filters.category) {
    where.category = {
      equals: filters.category,
      mode: "insensitive"
    };
  }

  if (user.role === "ADMIN") {
    where.status = filters.status ?? "ATIVO";
  } else {
    where.status = "ATIVO";
  }

  return where;
}

function toProductResponse(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    stockQuantity: product.stockQuantity,
    minimumStock: product.minimumStock,
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
}
