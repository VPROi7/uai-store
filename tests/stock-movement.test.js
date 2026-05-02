import request from "supertest";
import { jest } from "@jest/globals";

import { createApp } from "../src/app.js";
import { stockMovementRepository } from "../src/repositories/stock-movement.repository.js";
import { userRepository } from "../src/repositories/user.repository.js";
import { tokenService } from "../src/services/token.service.js";

const adminUser = {
  id: 1,
  name: "Administrador",
  email: "admin@uaistore.com",
  role: "ADMIN"
};

const clientUser = {
  id: 2,
  name: "Cliente",
  email: "cliente@uaistore.com",
  role: "CLIENTE"
};

const product = {
  id: 10,
  name: "Queijo Canastra",
  category: "Queijos",
  status: "ATIVO"
};

const movement = {
  id: 50,
  productId: 10,
  userId: 1,
  type: "ENTRADA",
  quantity: 10,
  reason: "Compra de reposicao",
  createdAt: new Date("2026-05-02T10:00:00.000Z"),
  product,
  user: adminUser
};

function bearerToken(user) {
  return `Bearer ${tokenService.sign(user)}`;
}

describe("Movimentacoes de estoque", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve registrar entrada de estoque como ADMIN", async () => {
    const app = createApp();

    jest.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    jest.spyOn(stockMovementRepository, "createMovement").mockResolvedValue({
      product: { ...product, stockQuantity: 15 },
      movement,
      insufficientStock: false
    });

    const response = await request(app)
      .post("/movimentacoes")
      .set("Authorization", bearerToken(adminUser))
      .send({
        produtoId: 10,
        tipo: "ENTRADA",
        quantidade: 10,
        motivo: "Compra de reposicao"
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: 50,
      produtoId: 10,
      tipo: "ENTRADA",
      quantidade: 10,
      motivo: "Compra de reposicao"
    });
    expect(stockMovementRepository.createMovement).toHaveBeenCalledWith({
      productId: 10,
      type: "ENTRADA",
      quantity: 10,
      reason: "Compra de reposicao",
      userId: 1
    });
  });

  it("deve rejeitar movimentacao com quantidade zero ou negativa", async () => {
    const app = createApp();

    jest.spyOn(userRepository, "findById").mockResolvedValue(adminUser);

    const response = await request(app)
      .post("/movimentacoes")
      .set("Authorization", bearerToken(adminUser))
      .send({
        produtoId: 10,
        tipo: "SAIDA",
        quantidade: 0,
        motivo: "Perda"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Erro de validacao.");
  });

  it("deve rejeitar saida maior que o estoque disponivel", async () => {
    const app = createApp();

    jest.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    jest.spyOn(stockMovementRepository, "createMovement").mockResolvedValue({
      product: { ...product, stockQuantity: 1 },
      movement: null,
      insufficientStock: true
    });

    const response = await request(app)
      .post("/movimentacoes")
      .set("Authorization", bearerToken(adminUser))
      .send({
        produtoId: 10,
        tipo: "SAIDA",
        quantidade: 2,
        motivo: "Ajuste de estoque"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Estoque insuficiente para realizar a saida.");
  });

  it("deve rejeitar produto inexistente", async () => {
    const app = createApp();

    jest.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    jest.spyOn(stockMovementRepository, "createMovement").mockResolvedValue({
      product: null,
      movement: null
    });

    const response = await request(app)
      .post("/movimentacoes")
      .set("Authorization", bearerToken(adminUser))
      .send({
        produtoId: 999,
        tipo: "ENTRADA",
        quantidade: 3,
        motivo: "Compra"
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Produto nao encontrado.");
  });

  it("deve impedir CLIENTE de registrar movimentacao", async () => {
    const app = createApp();

    jest.spyOn(userRepository, "findById").mockResolvedValue(clientUser);

    const response = await request(app)
      .post("/movimentacoes")
      .set("Authorization", bearerToken(clientUser))
      .send({
        produtoId: 10,
        tipo: "ENTRADA",
        quantidade: 3,
        motivo: "Compra"
      });

    expect(response.status).toBe(403);
  });

  it("deve listar historico com filtros", async () => {
    const app = createApp();

    jest.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    jest.spyOn(stockMovementRepository, "list").mockResolvedValue({
      items: [movement],
      total: 1
    });

    const response = await request(app)
      .get("/movimentacoes?produtoId=10&tipo=ENTRADA&dataInicio=2026-05-01&dataFim=2026-05-03&page=1&limit=5")
      .set("Authorization", bearerToken(adminUser));

    expect(response.status).toBe(200);
    expect(response.body.pagination).toMatchObject({
      page: 1,
      limit: 5,
      total: 1,
      totalPages: 1
    });
    expect(stockMovementRepository.list).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          productId: 10,
          type: "ENTRADA",
          createdAt: expect.objectContaining({
            gte: expect.any(Date),
            lte: expect.any(Date)
          })
        }),
        skip: 0,
        take: 5
      })
    );
  });
});
