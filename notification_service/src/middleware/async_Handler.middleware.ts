import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

// Type untuk response data yang valid
type ValidResponseBody =
  | Record<string, unknown>
  | Array<unknown>
  | string
  | number
  | boolean
  | null;

// Type untuk request body yang valid
type ValidRequestBody = Record<string, unknown> | Array<unknown>;

// Type untuk locals yang valid
type ValidLocals = Record<string, unknown>;

type AsyncRequestHandler<
  P = ParamsDictionary,
  ResBody extends ValidResponseBody = ValidResponseBody,
  ReqBody extends ValidRequestBody = ValidRequestBody,
  ReqQuery = ParsedQs,
  Locals extends ValidLocals = ValidLocals
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
  res: Response<ResBody, Locals>,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = <
  P = ParamsDictionary,
  ResBody extends ValidResponseBody = ValidResponseBody,
  ReqBody extends ValidRequestBody = ValidRequestBody,
  ReqQuery = ParsedQs,
  Locals extends ValidLocals = ValidLocals
>(
  fn: AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>
): AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
