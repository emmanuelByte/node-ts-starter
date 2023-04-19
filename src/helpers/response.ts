import { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any = null
): Response => {
  const response = {
    message,
    data,
  };

  return res.status(statusCode).json(response);
};
