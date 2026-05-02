import { Router } from "express";

import { stockMovementController } from "../controllers/stock-movement.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export const stockMovementRoutes = Router();

stockMovementRoutes.use(authenticate);
stockMovementRoutes.post("/", authorize(["ADMIN"]), stockMovementController.create);
stockMovementRoutes.get("/", authorize(["ADMIN"]), stockMovementController.list);
