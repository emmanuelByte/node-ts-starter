import { Response } from 'express';

export const sendResponse = (res: Response, statusCode: number, message: string, data: unknown = null): Response => {
  const response = {
    message,
    data,
  };

  return res.status(statusCode).json(response);
};
