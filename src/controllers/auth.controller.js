import { authService } from "../services/auth.service.js";
import { loginSchema } from "../validations/auth.validation.js";

export const authController = {
  async login(request, response) {
    const data = loginSchema.parse(request.body);
    const result = await authService.login(data);

    return response.status(200).json(result);
  }
};
