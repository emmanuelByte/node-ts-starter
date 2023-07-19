import { Response } from 'express';
export type responseType = {
  success: boolean;
  message: string;
  data: unknown;
  statusCode: number;
};
export const sendResponse = (d: { res: Response; statusCode: number; message: string; data?: unknown }): Response => {
  const { res, statusCode, message, data } = d;
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
    statusCode,
  };

  return res.status(statusCode).json(response);
};
