import { z } from "zod";

export const createStockMovementSchema = z
  .object({
    produtoId: z.coerce
      .number({
        required_error: "Produto e obrigatorio."
      })
      .int("Produto deve ser um ID inteiro.")
      .positive("Produto deve ser maior que zero."),
    tipo: z.enum(["ENTRADA", "SAIDA"], {
      required_error: "Tipo da movimentacao e obrigatorio."
    }),
    quantidade: z.coerce
      .number({
        required_error: "Quantidade e obrigatoria."
      })
      .int("Quantidade deve ser um numero inteiro.")
      .positive("Quantidade deve ser maior que zero."),
    motivo: z
      .string({
        required_error: "Motivo e obrigatorio."
      })
      .trim()
      .min(1, "Motivo e obrigatorio.")
  })
  .strict();

export const listStockMovementsSchema = z
  .object({
    produtoId: z.coerce.number().int().positive().optional(),
    tipo: z.enum(["ENTRADA", "SAIDA"]).optional(),
    dataInicio: z.coerce.date().optional(),
    dataFim: z.coerce.date().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10)
  })
  .refine(
    (data) => {
      if (!data.dataInicio || !data.dataFim) {
        return true;
      }

      return data.dataInicio <= data.dataFim;
    },
    {
      message: "Data inicial deve ser menor ou igual a data final.",
      path: ["dataInicio"]
    }
  );
