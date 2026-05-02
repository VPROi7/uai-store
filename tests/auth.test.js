import bcrypt from "bcryptjs";
import request from "supertest";
import { jest } from "@jest/globals";

import { createApp } from "../src/app.js";
import { userRepository } from "../src/repositories/user.repository.js";

describe("Autenticacao", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve autenticar usuario com email e senha validos", async () => {
    const app = createApp();
    const passwordHash = await bcrypt.hash("admin123", 10);

    jest.spyOn(userRepository, "findByEmail").mockResolvedValue({
      id: 1,
      name: "Administrador",
      email: "admin@uaistore.com",
      passwordHash,
      role: "ADMIN"
    });

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "admin@uaistore.com",
        password: "admin123"
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({
      id: 1,
      email: "admin@uaistore.com",
      role: "ADMIN"
    });
  });

  it("deve rejeitar login com credenciais invalidas", async () => {
    const app = createApp();

    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "admin@uaistore.com",
        password: "senha-errada"
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email ou senha invalidos.");
  });

  it("deve rejeitar rota protegida sem token JWT", async () => {
    const app = createApp();

    const response = await request(app).get("/produtos");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token JWT nao informado.");
  });
});
