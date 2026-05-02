import { ApiError } from "../errors/api-error.js";

export function authorize(roles) {
  return (request, _response, next) => {
    if (!request.user) {
      throw new ApiError(401, "Usuario nao autenticado.");
    }

    if (!roles.includes(request.user.role)) {
      throw new ApiError(403, "Usuario sem permissao para acessar este recurso.");
    }

    return next();
  };
}
