import { Response } from "express";

export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
) => {
  return res
    .status(statusCode)
    .json({ status: "success", message, data: data || null });
};

export const sendFail = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: any,
) => {
  return res
    .status(statusCode)
    .json({ status: "fail", message, errors: errors || null });
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  stackTrace?: string,
) => {
  return res
    .status(statusCode)
    .json({
      status: "error",
      message,
      debug: process.env.NODE_ENV === "development" ? stackTrace : null,
    });
};
