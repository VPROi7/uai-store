import { ZodError } from "zod";

import { ApiError } from "../errors/api-error.js";

export function errorHandler(error, _request, response, _next) {
  if (error instanceof ApiError) {
    return response.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Erro de validacao.",
      details: error.flatten()
    });
  }

  console.error(error);

  return response.status(500).json({
    message: "Erro interno do servidor."
  });
}
