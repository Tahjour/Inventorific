//api---------------------------------
import { StatusCodes } from "http-status-codes";
import { NextApiResponse } from "next";
import { ResponseData } from "../types/api";
import { logger } from "./logger";
import { ErrorMessages } from "./messages";
export class ResponseError extends Error {
  readonly statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function handleError(res: NextApiResponse, error: unknown): void {
  // Handle any error that occurs during the process and send an appropriate error message as JSON.
  logger.error(error);
  const data: ResponseData = {
    type: "error",
    message: error instanceof ResponseError ? error.message : ErrorMessages.InternalServerError,
  };

  // Set the response status to the appropriate status code based on the error and send the `data` object as JSON.
  error instanceof ResponseError
    ? res.status(error.statusCode).json(data)
    : res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(data);
}
