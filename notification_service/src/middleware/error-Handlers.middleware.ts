import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { errorResponse } from "../utils/error/error.js";
import { MIDDLEWARES_CONSTANTS } from "../constants/middlewares.constants";

export const errorHandlers: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof errorResponse) {
    res.status(err.status).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    status: "error",
    message: MIDDLEWARES_CONSTANTS.MESSAGES.SERVER_ERROR,
  });
  return;
};
