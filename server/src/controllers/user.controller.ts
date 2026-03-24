import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { createEmployeeService } from "../services/user.service";
import * as userService from "../services/user.service";
import { sendSuccess, sendFail, sendError } from "../utils/apiResponse";

/* =============================
   Create User Service
   *TODO: This function manage the request to create a new user in the farm.
   =============================*/
export const createEmployeeUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Confiamos ciegamente en el middleware de auth
    const requesterId = req.user!.id;

    // Confiamos ciegamente en Zod, los datos ya vienen validados y tipados
    const { email, password, name, farmId, role } = req.body;

    // Llamamos a la lógica de negocio
    const newEmployeeData = await createEmployeeService(requesterId, {
      email,
      name,
      password,
      farmId,
      role: role || "User", // Si no se especifica un rol, asignamos "User" por defecto
    });

    sendSuccess(res, 201, "User created successfully", newEmployeeData);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[UserController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while creating user",
        error.message,
      );
    }
  }
};

/* =============================
   Update User Service
   *TODO: This function manage the request to update a user's information in the farm.
   =============================*/
export const updateEmployeeUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const targetUserId = req.params.userId;
    const { farmId, name, email, role, active } = req.body;

    const udpateData = await userService.updateEmployeeService(
      requesterId,
      targetUserId as string,
      {
        farmId,
        name,
        email,
        role,
        active,
      },
    );

    sendSuccess(res, 200, "User updated successfully", udpateData);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[UserController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while updating user.",
        error.message,
      );
    }
  }
};

/* =============================
   Delete User Service
   *TODO: This function manage the request to delete a user from the farm.
   =============================*/
export const deleteEmployeeUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const targetUserId = req.params.userId;
    const { farmId } = req.body;

    await userService.deleteEmployeeService(
      requesterId,
      targetUserId as string,
      farmId,
    );

    sendSuccess(
      res,
      200,
      "User permanently removed from farm (No activity found).",
    );
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[DeleteUser Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while deleting user.",
        error.message,
      );
    }
  }
};
