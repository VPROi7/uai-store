const errorResponse = (description, exampleMessage) => ({
  description,
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
      example: {
        message: exampleMessage
      }
    }
  }
});

export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "UAI Store API",
    version: "0.1.0",
    description:
      "API backend para controle de estoque da UAI Store: queijos e doces de leite importados de Minas Gerais."
  },
  tags: [
    { name: "Health", description: "Verificacao operacional da API" },
    { name: "Auth", description: "Autenticacao JWT" },
    { name: "Produtos", description: "Cadastro, consulta e atualizacao de produtos" },
    { name: "Movimentacoes", description: "Entrada, saida e historico de estoque" }
  ],
  servers: [
    {
      url: "http://localhost:3000",
      description: "Ambiente local"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Erro de validacao." },
          details: {
            nullable: true,
            description: "Detalhes opcionais do erro, normalmente retornados em validacoes."
          }
        }
      },
      Pagination: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          total: { type: "integer", example: 1 },
          totalPages: { type: "integer", example: 1 }
        }
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "admin@uaistore.com" },
          password: { type: "string", format: "password", example: "admin123" }
        }
      },
      AuthenticatedUser: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Administrador" },
          email: { type: "string", format: "email", example: "admin@uaistore.com" },
          role: { type: "string", enum: ["ADMIN", "CLIENTE"], example: "ADMIN" }
        }
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          tokenType: { type: "string", example: "Bearer" },
          expiresIn: { type: "string", example: "1h" },
          user: { $ref: "#/components/schemas/AuthenticatedUser" }
        }
      },
      ProductInput: {
        type: "object",
        required: ["name", "category", "price", "stockQuantity", "minimumStock"],
        properties: {
          name: { type: "string", minLength: 3, example: "Queijo Canastra" },
          category: { type: "string", example: "Queijos" },
          price: { type: "number", minimum: 0.01, example: 49.9 },
          stockQuantity: { type: "integer", minimum: 0, example: 10 },
          minimumStock: { type: "integer", minimum: 0, example: 2 }
        }
      },
      ProductUpdateInput: {
        type: "object",
        properties: {
          name: { type: "string", example: "Queijo Canastra Premium" },
          category: { type: "string", example: "Queijos" },
          price: { type: "number", minimum: 0.01, example: 59.9 },
          minimumStock: { type: "integer", minimum: 0, example: 3 },
          status: { type: "string", enum: ["ATIVO", "INATIVO"], example: "ATIVO" }
        }
      },
      ProductResponse: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Queijo Canastra" },
          category: { type: "string", example: "Queijos" },
          price: { type: "number", example: 49.9 },
          stockQuantity: { type: "integer", example: 10 },
          minimumStock: { type: "integer", example: 2 },
          status: { type: "string", enum: ["ATIVO", "INATIVO"], example: "ATIVO" },
          createdAt: { type: "string", format: "date-time", example: "2026-05-02T22:00:00.000Z" },
          updatedAt: { type: "string", format: "date-time", example: "2026-05-02T22:00:00.000Z" }
        }
      },
      ProductListResponse: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/ProductResponse" }
          },
          pagination: { $ref: "#/components/schemas/Pagination" }
        }
      },
      StockMovementInput: {
        type: "object",
        required: ["produtoId", "tipo", "quantidade", "motivo"],
        properties: {
          produtoId: { type: "integer", minimum: 1, example: 1 },
          tipo: { type: "string", enum: ["ENTRADA", "SAIDA"], example: "ENTRADA" },
          quantidade: { type: "integer", minimum: 1, example: 10 },
          motivo: { type: "string", example: "Compra de reposicao" }
        }
      },
      StockMovementProduct: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Queijo Canastra" },
          category: { type: "string", example: "Queijos" }
        }
      },
      StockMovementResponse: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          produtoId: { type: "integer", example: 1 },
          produto: { $ref: "#/components/schemas/StockMovementProduct" },
          tipo: { type: "string", enum: ["ENTRADA", "SAIDA"], example: "ENTRADA" },
          quantidade: { type: "integer", example: 10 },
          motivo: { type: "string", example: "Compra de reposicao" },
          usuarioResponsavel: { $ref: "#/components/schemas/AuthenticatedUser" },
          criadoEm: { type: "string", format: "date-time", example: "2026-05-02T22:00:00.000Z" }
        }
      },
      StockMovementListResponse: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/StockMovementResponse" }
          },
          pagination: { $ref: "#/components/schemas/Pagination" }
        }
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "ok" },
          app: { type: "string", example: "uai-store-api" },
          environment: { type: "string", example: "development" }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Verifica a saude da API",
        responses: {
          200: {
            description: "API em funcionamento",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" }
              }
            }
          }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Autentica usuario e retorna JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" }
            }
          }
        },
        responses: {
          200: {
            description: "Login realizado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" }
              }
            }
          },
          400: errorResponse("Dados invalidos", "Erro de validacao."),
          401: errorResponse("Email ou senha invalidos", "Email ou senha invalidos.")
        }
      }
    },
    "/produtos": {
      get: {
        tags: ["Produtos"],
        summary: "Lista produtos",
        description:
          "CLIENTE consulta apenas produtos ATIVO. ADMIN pode informar status ATIVO ou INATIVO.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "name", in: "query", description: "Busca parcial por nome", schema: { type: "string" } },
          { name: "category", in: "query", description: "Filtro por categoria", schema: { type: "string" } },
          {
            name: "status",
            in: "query",
            description: "Filtro permitido para ADMIN",
            schema: { type: "string", enum: ["ATIVO", "INATIVO"] }
          },
          { name: "orderBy", in: "query", schema: { type: "string", enum: ["name", "price"], default: "name" } },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "asc" } },
          { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 10 } }
        ],
        responses: {
          200: {
            description: "Produtos listados com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductListResponse" }
              }
            }
          },
          400: errorResponse("Parametros invalidos", "Erro de validacao."),
          401: errorResponse("Token ausente, invalido ou expirado", "Token JWT nao informado.")
        }
      },
      post: {
        tags: ["Produtos"],
        summary: "Cadastra produto",
        description: "Somente ADMIN pode cadastrar produto. O status inicial sempre sera ATIVO.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductInput" }
            }
          }
        },
        responses: {
          201: {
            description: "Produto cadastrado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductResponse" }
              }
            }
          },
          400: errorResponse("Dados invalidos", "Erro de validacao."),
          401: errorResponse("Token ausente, invalido ou expirado", "Token JWT nao informado."),
          403: errorResponse("Usuario sem permissao", "Usuario sem permissao para acessar este recurso."),
          409: errorResponse("Produto ativo duplicado", "Ja existe produto ativo com este nome.")
        }
      }
    },
    "/produtos/{id}": {
      get: {
        tags: ["Produtos"],
        summary: "Consulta produto por ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 }
          }
        ],
        responses: {
          200: {
            description: "Produto encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductResponse" }
              }
            }
          },
          400: errorResponse("ID invalido", "Erro de validacao."),
          401: errorResponse("Token ausente, invalido ou expirado", "Token JWT nao informado."),
          404: errorResponse("Produto nao encontrado", "Produto nao encontrado.")
        }
      },
      put: {
        tags: ["Produtos"],
        summary: "Atualiza produto",
        description:
          "Somente ADMIN pode atualizar produto. O estoque nao pode ser alterado por este endpoint.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductUpdateInput" }
            }
          }
        },
        responses: {
          200: {
            description: "Produto atualizado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductResponse" }
              }
            }
          },
          400: errorResponse("Dados invalidos", "Erro de validacao."),
          401: errorResponse("Token ausente, invalido ou expirado", "Token JWT nao informado."),
          403: errorResponse("Usuario sem permissao", "Usuario sem permissao para acessar este recurso."),
          404: errorResponse("Produto nao encontrado", "Produto nao encontrado."),
          409: errorResponse("Produto ativo duplicado", "Ja existe produto ativo com este nome.")
        }
      }
    },
    "/movimentacoes": {
      get: {
        tags: ["Movimentacoes"],
        summary: "Lista historico de movimentacoes",
        description: "Somente ADMIN pode consultar o historico de movimentacoes.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "produtoId", in: "query", schema: { type: "integer", minimum: 1 } },
          { name: "tipo", in: "query", schema: { type: "string", enum: ["ENTRADA", "SAIDA"] } },
          { name: "dataInicio", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "dataFim", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 10 } }
        ],
        responses: {
          200: {
            description: "Historico listado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/StockMovementListResponse" }
              }
            }
          },
          400: errorResponse("Parametros invalidos", "Erro de validacao."),
          401: errorResponse("Token ausente, invalido ou expirado", "Token JWT nao informado."),
          403: errorResponse("Usuario sem permissao", "Usuario sem permissao para acessar este recurso.")
        }
      },
      post: {
        tags: ["Movimentacoes"],
        summary: "Registra entrada ou saida de estoque",
        description:
          "Somente ADMIN pode registrar movimentacao. Toda movimentacao atualiza o estoque e gera historico.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/StockMovementInput" },
              examples: {
                entrada: {
                  summary: "Entrada de estoque",
                  value: {
                    produtoId: 1,
                    tipo: "ENTRADA",
                    quantidade: 10,
                    motivo: "Compra de reposicao"
                  }
                },
                saida: {
                  summary: "Saida de estoque",
                  value: {
                    produtoId: 1,
                    tipo: "SAIDA",
                    quantidade: 2,
                    motivo: "Ajuste de estoque"
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Movimentacao registrada com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/StockMovementResponse" }
              }
            }
          },
          400: errorResponse("Dados invalidos ou estoque insuficiente", "Estoque insuficiente para realizar a saida."),
          401: errorResponse("Token ausente, invalido ou expirado", "Token JWT nao informado."),
          403: errorResponse("Usuario sem permissao", "Usuario sem permissao para acessar este recurso."),
          404: errorResponse("Produto nao encontrado", "Produto nao encontrado.")
        }
      }
    }
  }
};
