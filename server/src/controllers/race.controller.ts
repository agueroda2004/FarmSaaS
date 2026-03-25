import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as raceService from "../services/race.service";
import { sendSuccess, sendFail, sendError } from "../utils/apiResponse";

/* =============================
   Create Race Service
   *DOES: This function manage the request to create a race on the farm.
   =============================*/
export const createRace = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const { farmId, name } = req.body;

    const race = await raceService.createRaceService(requesterId, {
      farmId,
      name,
    });

    sendSuccess(res, 201, "Race created successfully", race);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[RaceController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while creating race.",
        error.message,
      );
    }
  }
};

/* =============================
   Get Races Service
   *DOES: This function manage the request to fetch races from the farm.
   =============================*/
export const getRaces = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const farmId = Number(req.query.farmId);

    const races = await raceService.getRacesService(requesterId, farmId);

    sendSuccess(res, 200, "Races fetched successfully", races);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[RaceController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while fetching races.",
        error.message,
      );
    }
  }
};

/* =============================
   Update Race Service
   *DOES: This function manage the request to update a race on the farm.
   =============================*/
export const updateRace = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const raceId = Number(req.params.raceId);
    const { farmId, name, active } = req.body;

    const updatedRace = await raceService.updateRaceService(
      requesterId,
      raceId,
      {
        farmId,
        name,
        active,
      },
    );
    sendSuccess(res, 200, "Race updated successfully", updatedRace);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[RaceController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while updating race.",
        error.message,
      );
    }
  }
};

/* =============================
   Delete Race Service
   *DOES: This function manage the request to delete a race on the farm.
   =============================*/
export const deleteRace = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const raceId = Number(req.params.raceId);
    const { farmId } = req.body;

    await raceService.deleteRaceService(requesterId, farmId, raceId);

    sendSuccess(res, 200, "Race deleted successfully");
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[RaceController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while deleting race.",
        error.message,
      );
    }
  }
};

export const getSingleRace = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const raceId = Number(req.params.raceId);
    const farmId = Number(req.query.farmId);

    const race = await raceService.getSingleRaceService(
      requesterId,
      raceId,
      farmId,
    );

    sendSuccess(res, 200, "Race fetched successfully", race);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[RaceController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while fetching race.",
        error.message,
      );
    }
  }
};
