import bcrypt from "bcryptjs";

import { ApiError } from "../errors/api-error.js";
import { userRepository } from "../repositories/user.repository.js";
import { tokenService } from "./token.service.js";

export const authService = {
  async login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new ApiError(401, "Email ou senha invalidos.");
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new ApiError(401, "Email ou senha invalidos.");
    }

    const token = tokenService.sign(user);

    return {
      token,
      tokenType: "Bearer",
      expiresIn: envSafeExpiresIn(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
};

function envSafeExpiresIn() {
  return process.env.JWT_EXPIRES_IN ?? "1h";
}
