import { ApiError } from "../errors/api-error.js";
import { stockMovementRepository } from "../repositories/stock-movement.repository.js";

export const stockMovementService = {
  async create(data, user) {
    const result = await stockMovementRepository.createMovement({
      productId: data.produtoId,
      type: data.tipo,
      quantity: data.quantidade,
      reason: data.motivo,
      userId: user.id
    });

    if (!result.product) {
      throw new ApiError(404, "Produto nao encontrado.");
    }

    if (result.inactiveProduct) {
      throw new ApiError(400, "Produto inativo nao pode receber movimentacao de estoque.");
    }

    if (result.insufficientStock) {
      throw new ApiError(400, "Estoque insuficiente para realizar a saida.");
    }

    return toStockMovementResponse(result.movement);
  },

  async list(filters) {
    const page = filters.page;
    const limit = filters.limit;
    const where = buildListWhere(filters);
    const { items, total } = await stockMovementRepository.list({
      where,
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      data: items.map(toStockMovementResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
};

function buildListWhere(filters) {
  const where = {};

  if (filters.produtoId) {
    where.productId = filters.produtoId;
  }

  if (filters.tipo) {
    where.type = filters.tipo;
  }

  if (filters.dataInicio || filters.dataFim) {
    where.createdAt = {};

    if (filters.dataInicio) {
      where.createdAt.gte = filters.dataInicio;
    }

    if (filters.dataFim) {
      where.createdAt.lte = filters.dataFim;
    }
  }

  return where;
}

function toStockMovementResponse(movement) {
  return {
    id: movement.id,
    produtoId: movement.productId,
    produto: movement.product
      ? {
          id: movement.product.id,
          name: movement.product.name,
          category: movement.product.category
        }
      : undefined,
    tipo: movement.type,
    quantidade: movement.quantity,
    motivo: movement.reason,
    usuarioResponsavel: movement.user
      ? {
          id: movement.user.id,
          name: movement.user.name,
          email: movement.user.email,
          role: movement.user.role
        }
      : undefined,
    criadoEm: movement.createdAt
  };
}
