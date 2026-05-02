import { Router } from "express";

import { authRoutes } from "./auth.routes.js";
import { productRoutes } from "./product.routes.js";
import { stockMovementRoutes } from "./stock-movement.routes.js";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/produtos", productRoutes);
routes.use("/movimentacoes", stockMovementRoutes);
