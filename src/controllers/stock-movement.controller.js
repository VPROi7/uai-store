import { stockMovementService } from "../services/stock-movement.service.js";
import {
  createStockMovementSchema,
  listStockMovementsSchema
} from "../validations/stock-movement.validation.js";

export const stockMovementController = {
  async create(request, response) {
    const data = createStockMovementSchema.parse(request.body);
    const movement = await stockMovementService.create(data, request.user);

    return response.status(201).json(movement);
  },

  async list(request, response) {
    const filters = listStockMovementsSchema.parse(request.query);
    const result = await stockMovementService.list(filters);

    return response.status(200).json(result);
  }
};
