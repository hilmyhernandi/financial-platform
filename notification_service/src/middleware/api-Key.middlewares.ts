import { Request, Response, NextFunction } from "express";
import { environment } from "../config/environment";
import { MIDDLEWARES_CONSTANTS } from "../constants/middlewares.constants";

export const verifyApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKeyHeader = req.headers["authorization"];

  if (!apiKeyHeader || !apiKeyHeader.startsWith("Api-Key ")) {
    return res
      .status(401)
      .json({ message: MIDDLEWARES_CONSTANTS.MESSAGES.API_KEY_HEADER_MISSING });
  }

  const apiKey = apiKeyHeader.replace("Api-Key ", "");
  const validKey = environment.secret.apikey;

  if (apiKey !== validKey) {
    return res
      .status(403)
      .json({ message: MIDDLEWARES_CONSTANTS.MESSAGES.API_KEY_INVALID });
  }

  next();
};
