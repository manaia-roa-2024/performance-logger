import { NextFunction, Request, Response } from "express";
import ProblemDetails from "../ProblemDetails";
import { UnauthorizedError } from "express-jwt";

export default async function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction){
  if (res.headersSent) {
    return next(err)
  }

  if (process.env.NODE_ENV !== 'production')
    console.log(err)
  
  if (err instanceof ProblemDetails){
    res.status(err.statusCode)
    res.json(err)
    return
  } else if (err instanceof UnauthorizedError){
    const pd = new ProblemDetails()
    pd.statusCode = err.status
    pd.message = err.inner.message
    res.status(pd.statusCode).json(pd)
    return
  }
  const pd = ProblemDetails.UnknownError()
  res.status(pd.statusCode)
  res.json(pd)
}