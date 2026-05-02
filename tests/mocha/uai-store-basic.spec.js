import { expect } from "chai";
import request from "supertest";

import { createApp } from "../../src/app.js";
import { productRepository } from "../../src/repositories/product.repository.js";
import { stockMovementRepository } from "../../src/repositories/stock-movement.repository.js";
import { userRepository } from "../../src/repositories/user.repository.js";
import { tokenService } from "../../src/services/token.service.js";

const app = createApp();

const adminUser = {
  id: 1,
  name: "Administrador",
  email: "admin@uaistore.com",
  role: "ADMIN"
};

const product = {
  id: 1,
  name: "Queijo Canastra",
  category: "Queijos",
  price: 49.9,
  stockQuantity: 10,
  minimumStock: 2,
  status: "ATIVO",
  createdAt: new Date("2026-05-02T10:00:00.000Z"),
  updatedAt: new Date("2026-05-02T10:00:00.000Z")
};

function bearerToken(user) {
  return `Bearer ${tokenService.sign(user)}`;
}

describe("UAI Store API - testes basicos com Mocha, Chai e Supertest", () => {
  const originals = {};

  beforeEach(() => {
    originals.findById = userRepository.findById;
    originals.findByEmail = userRepository.findByEmail;
    originals.findActiveByName = productRepository.findActiveByName;
    originals.createProduct = productRepository.create;
    originals.createMovement = stockMovementRepository.createMovement;
  });

  afterEach(() => {
    userRepository.findById = originals.findById;
    userRepository.findByEmail = originals.findByEmail;
    productRepository.findActiveByName = originals.findActiveByName;
    productRepository.create = originals.createProduct;
    stockMovementRepository.createMovement = originals.createMovement;
  });

  it("CT-003 deve rejeitar rota protegida sem token", async () => {
    const response = await request(app).get("/produtos");

    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal("Token JWT nao informado.");
  });

  it("CT-002 deve rejeitar login com email invalido", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "email-invalido",
      password: "admin123"
    });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Erro de validacao.");
  });

  it("CT-004 deve cadastrar produto como ADMIN usando mocks", async () => {
    userRepository.findById = async () => adminUser;
    productRepository.findActiveByName = async () => null;
    productRepository.create = async () => product;

    const response = await request(app)
      .post("/produtos")
      .set("Authorization", bearerToken(adminUser))
      .send({
        name: "Queijo Canastra",
        category: "Queijos",
        price: 49.9,
        stockQuantity: 10,
        minimumStock: 2
      });

    expect(response.status).to.equal(201);
    expect(response.body.name).to.equal("Queijo Canastra");
    expect(response.body.status).to.equal("ATIVO");
  });

  it("CT-005 deve rejeitar produto com preco zero", async () => {
    userRepository.findById = async () => adminUser;

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

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Erro de validacao.");
  });

  it("CT-012 deve rejeitar saida maior que estoque usando mocks", async () => {
    userRepository.findById = async () => adminUser;
    stockMovementRepository.createMovement = async () => ({
      product: { ...product, stockQuantity: 1 },
      movement: null,
      insufficientStock: true
    });

    const response = await request(app)
      .post("/movimentacoes")
      .set("Authorization", bearerToken(adminUser))
      .send({
        produtoId: 1,
        tipo: "SAIDA",
        quantidade: 2,
        motivo: "Ajuste de estoque"
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Estoque insuficiente para realizar a saida.");
  });
});
