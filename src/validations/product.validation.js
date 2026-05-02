import { z } from "zod";

const trimmedText = (fieldName, min = 1) =>
  z
    .string({
      required_error: `${fieldName} e obrigatorio.`
    })
    .trim()
    .min(min, `${fieldName} deve ter no minimo ${min} caractere(s).`);

const positivePrice = z.coerce
  .number({
    required_error: "Preco e obrigatorio.",
    invalid_type_error: "Preco deve ser numerico."
  })
  .positive("Preco deve ser maior que zero.");

const nonNegativeInteger = (fieldName) =>
  z.coerce
    .number({
      required_error: `${fieldName} e obrigatorio.`,
      invalid_type_error: `${fieldName} deve ser numerico.`
    })
    .int(`${fieldName} deve ser um numero inteiro.`)
    .min(0, `${fieldName} deve ser maior ou igual a zero.`);

export const createProductSchema = z
  .object({
    name: trimmedText("Nome", 3),
    category: trimmedText("Categoria"),
    price: positivePrice,
    stockQuantity: nonNegativeInteger("Quantidade inicial"),
    minimumStock: nonNegativeInteger("Estoque minimo")
  })
  .strict();

export const updateProductSchema = z
  .object({
    name: trimmedText("Nome", 1).optional(),
    category: trimmedText("Categoria").optional(),
    price: positivePrice.optional(),
    minimumStock: nonNegativeInteger("Estoque minimo").optional(),
    status: z.enum(["ATIVO", "INATIVO"]).optional()
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar."
  });

export const productIdSchema = z.coerce
  .number()
  .int("ID do produto deve ser inteiro.")
  .positive("ID do produto deve ser maior que zero.");

export const listProductsSchema = z.object({
  name: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  status: z.enum(["ATIVO", "INATIVO"]).optional(),
  orderBy: z.enum(["name", "price"]).default("name"),
  order: z.enum(["asc", "desc"]).default("asc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});
