import { Router } from "express";

import { productController } from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export const productRoutes = Router();

productRoutes.use(authenticate);
productRoutes.post("/", authorize(["ADMIN"]), productController.create);
productRoutes.get("/", productController.list);
productRoutes.get("/:id", productController.findById);
productRoutes.put("/:id", authorize(["ADMIN"]), productController.update);
