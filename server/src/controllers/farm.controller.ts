import { Request, Response } from "express";
import * as farmService from "../services/farm.service";

export const createFarm = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, owner } = req.body;

    if (!name) {
      res.status(400).json({ status: "error", message: "Nombre requerido" });
    }

    const newFarm = await farmService.createFarmService(name, owner);

    res.status(201).json({ status: "success", data: newFarm });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error en el servidor", error });
  }
};
