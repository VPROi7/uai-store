import request from "supertest";

import { createApp } from "../src/app.js";

describe("GET /health", () => {
  it("deve retornar status ok", async () => {
    const app = createApp();

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "ok",
      app: "uai-store-api"
    });
  });
});
