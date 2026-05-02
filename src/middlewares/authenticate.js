import { ApiError } from "../errors/api-error.js";
import { userRepository } from "../repositories/user.repository.js";
import { tokenService } from "../services/token.service.js";

export async function authenticate(request, _response, next) {
  const authorization = request.headers.authorization;

  if (!authorization) {
    throw new ApiError(401, "Token JWT nao informado.");
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Formato do token JWT invalido.");
  }

  try {
    const payload = tokenService.verify(token);
    const userId = Number(payload.sub);

    if (!Number.isInteger(userId)) {
      throw new ApiError(401, "Token JWT invalido.");
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(401, "Usuario do token nao encontrado.");
    }

    request.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Token JWT invalido ou expirado.");
  }
}
