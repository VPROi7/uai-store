import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export const tokenService = {
  sign(user) {
    return jwt.sign(
      {
        sub: String(user.id),
        role: user.role
      },
      env.jwtSecret,
      {
        expiresIn: env.jwtExpiresIn
      }
    );
  },

  verify(token) {
    return jwt.verify(token, env.jwtSecret);
  }
};
