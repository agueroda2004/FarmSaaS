import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as medicineService from "../services/medicine.service";
import { sendSuccess, sendError, sendFail } from "../utils/apiResponse";

export const createMedicine = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const { farmId, name } = req.body;

    const medicine = await medicineService.createMedicineService(requesterId, {
      farmId,
      name,
    });

    sendSuccess(res, 201, "Medicine created successfully", medicine);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[MedicineController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while creating medicine.",
        error.message,
      );
    }
  }
};

export const getMedicines = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const farmId = Number(req.query.farmId);
    const active = req.query.active as string | undefined;

    const medicines = await medicineService.getMedicinesService(
      requesterId,
      farmId,
      active,
    );

    sendSuccess(res, 200, "Medicines fetched successfully", medicines);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[MedicineController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while fetching medicines.",
        error.message,
      );
    }
  }
};

export const getSingleMedicine = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const medicineId = Number(req.params.medicineId);
    const farmId = Number(req.query.farmId);

    const medicine = await medicineService.getSingleMedicineService(
      requesterId,
      farmId,
      medicineId,
    );

    sendSuccess(res, 200, "Medicine fetched successfully", medicine);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[MedicineController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while fetching medicine.",
        error.message,
      );
    }
  }
};

export const updateMedicine = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const medicineId = Number(req.params.medicineId);
    const { farmId, name, active } = req.body;

    const updatedMedicine = await medicineService.updateMedicineService(
      requesterId,
      medicineId,
      {
        farmId,
        name,
        active,
      },
    );

    sendSuccess(res, 200, "Medicine updated successfully", updatedMedicine);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[MedicineController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while updating medicine.",
        error.message,
      );
    }
  }
};

export const deleteMedicine = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const medicineId = Number(req.params.medicineId);
    const { farmId } = req.body;

    await medicineService.deleteMedicineService(
      requesterId,
      farmId,
      medicineId,
    );

    sendSuccess(res, 200, "Medicine deleted successfully");
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[MedicineController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while deleting medicine.",
        error.message,
      );
    }
  }
};
