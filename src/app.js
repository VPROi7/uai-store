import "express-async-errors";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env.js";
import { swaggerDocument } from "./config/swagger.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { routes } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.status(200).json({
      status: "ok",
      app: "uai-store-api",
      environment: env.nodeEnv
    });
  });

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(routes);
  app.use(errorHandler);

  return app;
}
