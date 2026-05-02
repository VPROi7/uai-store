import request from "supertest";
import { jest } from "@jest/globals";

import { createApp } from "../src/app.js";
import { productRepository } from "../src/repositories/product.repository.js";
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
  price: 49.9,
  stockQuantity: 8,
  minimumStock: 2,
  status: "ATIVO",
  createdAt: new Date("2026-05-02T10:00:00.000Z"),
  updatedAt: new Date("2026-05-02T10:00:00.000Z")
};

function bearerToken(user) {
  return `Bearer ${tokenService.sign(user)}`;
}

describe("Produtos", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve cadastrar produto como ADMIN", async () => {
    const app = createApp();

    jest.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    jest.spyOn(productRepository, "findActiveByName").mockResolvedValue(null);
    jest.spyOn(productRepository, "create").mockResolvedValue(product);

    const response = await request(app)
      .post("/produtos")
      .set("Authorization", bearerToken(adminUser))
      .send({
        name: "Queijo Canastra",
        category: "Queijos",
        price: 49.9,
        stockQuantity: 8,
        minimumStock: 2
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: 10,
      name: "Queijo Canastra",
      status: "ATIVO"
    });
    expect(productRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "ATIVO"
      })
    );
  });

  it("deve rejeitar cadastro de produto ativo com nome duplicado", async () => {
    const app = createApp();

    jest.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    jest.spyOn(productRepository, "findActiveByName").mockResolvedValue(product);

    const response = await request(app)
      .post("/produtos")
      .set("Authorization", bearerToken(adminUser))
      .send({
        name: "Queijo Canastra",
        category: "Queijos",
        price: 49.9,
        stockQuantity: 8,
        minimumStock: 2
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Ja existe produto ativo com este nome.");
  });

  it("deve rejeitar cadastro com preco menor ou igual a zero", async () => {
    const app = createApp();

    jest.spyOn(userRepository, "findById").mockResolvedValue(adminUser);

    const response = await request(app)
      .post("/produtos")
      .set("Authorization", bearerToken(adminUser))
      .send({
        name: "Doce de Leite",
        category: "Doces",
        price: 0,
        stockQuantity: 5,
        minimumStock: 1
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Erro de validacao.");
  });

  it("deve impedir CLIENTE de cadastrar produto", async () => {
    const app = createApp();

    jest.spyOn(userRepository, "findById").mockResolvedValue(clientUser);

    const response = await request(app)
      .post("/produtos")
      .set("Authorization", bearerToken(clientUser))
      .send({
        name: "Queijo Minas",
        category: "Queijos",
        price: 25,
        stockQuantity: 3,
        minimumStock: 1
      });

    expect(response.status).toBe(403);
  });

  it("deve listar produtos ativos com paginacao e filtros", async () => {
    const app = createApp();

    jest.spyOn(userRepository, "findById").mockResolvedValue(clientUser);
    jest.spyOn(productRepository, "list").mockResolvedValue({
      items: [product],
      total: 1
    });

    const response = await request(app)
      .get("/produtos?name=canastra&category=Queijos&orderBy=price&order=desc&page=1&limit=5")
      .set("Authorization", bearerToken(clientUser));

    expect(response.status).toBe(200);
    expect(response.body.pagination).toMatchObject({
      page: 1,
      limit: 5,
      total: 1,
      totalPages: 1
    });
    expect(productRepository.list).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: "ATIVO"
        }),
        orderBy: { price: "desc" },
        skip: 0,
        take: 5
      })
    );
  });

  it("deve ocultar produto inativo para CLIENTE", async () => {
    const app = createApp();

    jest.spyOn(userRepository, "findById").mockResolvedValue(clientUser);
    jest.spyOn(productRepository, "findById").mockResolvedValue({
      ...product,
      status: "INATIVO"
    });

    const response = await request(app)
      .get("/produtos/10")
      .set("Authorization", bearerToken(clientUser));

    expect(response.status).toBe(404);
  });

  it("deve atualizar produto como ADMIN e registrar historico interno", async () => {
    const app = createApp();

    jest.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    jest.spyOn(productRepository, "findById").mockResolvedValue(product);
    jest.spyOn(productRepository, "findActiveByName").mockResolvedValue(null);
    jest.spyOn(productRepository, "updateWithHistory").mockResolvedValue({
      ...product,
      price: 55.5
    });

    const response = await request(app)
      .put("/produtos/10")
      .set("Authorization", bearerToken(adminUser))
      .send({
        price: 55.5
      });

    expect(response.status).toBe(200);
    expect(response.body.price).toBe(55.5);
    expect(productRepository.updateWithHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 10,
        data: { price: 55.5 },
        history: expect.objectContaining({
          productId: 10,
          userId: 1,
          action: "ATUALIZACAO"
        })
      })
    );
  });

  it("deve rejeitar tentativa de alterar ID do produto", async () => {
    const app = createApp();

    jest.spyOn(userRepository, "findById").mockResolvedValue(adminUser);

    const response = await request(app)
      .put("/produtos/10")
      .set("Authorization", bearerToken(adminUser))
      .send({
        id: 99,
        price: 55.5
      });

    expect(response.status).toBe(400);
  });
});
