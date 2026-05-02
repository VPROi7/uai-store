import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email e obrigatorio."
    })
    .trim()
    .email("Email deve ser valido."),
  password: z
    .string({
      required_error: "Senha e obrigatoria."
    })
    .min(1, "Senha e obrigatoria.")
});
