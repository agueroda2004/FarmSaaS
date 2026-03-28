import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as locationService from "../services/location.service";
import { sendSuccess, sendFail, sendError } from "../utils/apiResponse";

/* =============================
   Create Location Service
   DOES: This function manage the request to create a location on the farm.
   =============================*/
export const createLocation = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const { farmId, name, type, capacity, observation } = req.body;

    const location = await locationService.createLocationService(requesterId, {
      farmId,
      name,
      type,
      capacity,
      observation,
    });

    sendSuccess(res, 201, "Location created successfully.", location);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[LocationController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while creating location.",
        error.message,
      );
    }
  }
};

/* =============================
   Get Locations Service
   DOES: This function manage the request to get all location or get locations filter by type from the farm.
   =============================*/
export const getLocations = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const farmId = Number(req.query.farmId);
    const type = req.query.type as string | undefined;

    const locations = await locationService.getLocationsService(
      requesterId,
      farmId,
      type as any,
    );

    sendSuccess(res, 200, "Locations fetched successfully.", locations);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[LocationController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while fetching locations.",
        error.message,
      );
    }
  }
};

/* =============================
   Get Single Location Service
   DOES: This function manage the request to get a single location from the farm.
   =============================*/
export const getSingleLocation = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const locationId = Number(req.params.locationId);
    const farmId = Number(req.query.farmId);

    const location = await locationService.getSingleLocationService(
      requesterId,
      locationId,
      farmId,
    );

    sendSuccess(res, 200, "Location fetched successfully.", location);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[LocationController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while fetching locations.",
        error.message,
      );
    }
  }
};

/* =============================
   Update Location Service
   DOES: This function manage the request to update a location on the farm.
   =============================*/
export const updateLocation = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const locationId = Number(req.params.locationId);
    const { farmId, name, type, capacity, observation, active } = req.body;
    console.log(locationId);

    const updatedLocation = await locationService.updateLocationService(
      requesterId,
      locationId,
      {
        farmId,
        name,
        type,
        capacity,
        observation,
        active,
      },
    );

    sendSuccess(res, 200, "Location updated successfully.", updatedLocation);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[LocationController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while updating location.",
        error.message,
      );
    }
  }
};

/* =============================
   Create Race Service
   DOES: This function manage the request to delete a location on the farm.
   =============================*/
export const deleteLocation = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const locationId = Number(req.params.locationId);
    const { farmId } = req.body;

    await locationService.deleteLocationService(
      requesterId,
      locationId,
      farmId,
    );

    sendSuccess(res, 200, "Location deleted successfully.");
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      sendFail(res, statusCode, error.message);
    } else {
      console.error("[LocationController Error]:", error);
      sendError(
        res,
        500,
        "Internal server error while deleting location.",
        error.message,
      );
    }
  }
};
