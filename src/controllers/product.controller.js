import { productService } from "../services/product.service.js";
import {
  createProductSchema,
  listProductsSchema,
  productIdSchema,
  updateProductSchema
} from "../validations/product.validation.js";

export const productController = {
  async create(request, response) {
    const data = createProductSchema.parse(request.body);
    const product = await productService.create(data);

    return response.status(201).json(product);
  },

  async list(request, response) {
    const filters = listProductsSchema.parse(request.query);
    const result = await productService.list(filters, request.user);

    return response.status(200).json(result);
  },

  async findById(request, response) {
    const id = productIdSchema.parse(request.params.id);
    const product = await productService.findById(id, request.user);

    return response.status(200).json(product);
  },

  async update(request, response) {
    const id = productIdSchema.parse(request.params.id);
    const data = updateProductSchema.parse(request.body);
    const product = await productService.update(id, data, request.user);

    return response.status(200).json(product);
  }
};
