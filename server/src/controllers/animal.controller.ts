import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as animalService from "../services/animla.service";
import { sendSuccess, sendError, sendFail } from "../utils/apiResponse";

/* =============================
   Create Animal Controller
   DOES: This function manage the request to create an animal on the farm.
   =============================*/
export const createAnimal = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const {
      farmId,
      raceId,
      tagNumber,
      type,
      entryDate,
      bornDate,
      parity,
      locationId,
      observation,
    } = req.body;

    const animal = await animalService.createAnimalService(requesterId, {
      farmId,
      raceId,
      tagNumber,
      type,
      entryDate,
      bornDate,
      parity,
      locationId,
      observation,
    });

    sendSuccess(res, 201, "Animal created successfully", animal);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[AnimalController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while creating animal.",
        error.message,
      );
    }
  }
};

/* =============================
   Get Animals Controller
   DOES: This function manage the request to get all animals or get animals filter by type, race, location or active status from the farm.
   =============================*/
export const getAnimals = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const farmId = Number(req.query.farmId);
    const { type, active } = req.query;
    const raceId = req.query.raceId ? Number(req.query.raceId) : undefined;
    const locationId = req.query.locationId
      ? Number(req.query.locationId)
      : undefined;

    console.log(requesterId);
    console.log(farmId);
    const animals = await animalService.getAnimalsService(requesterId, farmId, {
      type: type as any,
      raceId,
      locationId,
      active: active as string | undefined,
    });
    console.log(animals);
    sendSuccess(res, 200, "Animals fetched successfully", animals);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[AnimalController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while fetching animals.",
        error.message,
      );
    }
  }
};

/* =============================
   Get Single Animal Controller
   DOES: This function manage the request to get a single animal from the farm.
   =============================*/
export const getSingleAnimal = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const animalId = Number(req.params.animalId);
    const farmId = Number(req.query.farmId);

    const animal = await animalService.getSingleAnimalService(
      requesterId,
      animalId,
      farmId,
    );

    sendSuccess(res, 200, "Animal fetched successfully", animal);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[AnimalController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while fetching animal.",
        error.message,
      );
    }
  }
};

/* =============================
   Update Animal Controller
   DOES: This function manage the request to update an animal on the farm.
   =============================*/
export const updateAnimal = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const animalId = Number(req.params.animalId);
    const {
      farmId,
      raceId,
      tagNumber,
      entryDate,
      bornDate,
      parity,
      locationId,
      observation,
      active,
    } = req.body;

    const updatedAnimal = await animalService.updateAnimalService(
      requesterId,
      animalId,
      {
        farmId,
        raceId,
        tagNumber,
        entryDate,
        bornDate,
        parity,
        locationId,
        observation,
        active,
      },
    );

    sendSuccess(res, 200, "Animal updated successfully", updatedAnimal);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[AnimalController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while updating animal.",
        error.message,
      );
    }
  }
};

/* =============================
   Delete Animal Controller
   DOES: This function manage the request to delete an animal on the farm.
   =============================*/
export const deleteAnimal = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const animalId = Number(req.params.animalId);
    const { farmId } = req.body;

    await animalService.deleteAnimalService(requesterId, animalId, farmId);

    sendSuccess(res, 200, "Animal deleted successfully");
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[AnimalController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while deleting animal.",
        error.message,
      );
    }
  }
};
