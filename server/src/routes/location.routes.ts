import { Router } from "express";
import {
  createLocation,
  getLocations,
  getSingleLocation,
  updateLocation,
  deleteLocation,
} from "../controllers/location.controller";
import { protectRoute } from "../middlewares/authMiddleware";
import { validateSchema } from "../middlewares/validateMiddleware";
import {
  createLocationSchema,
  getLocationsSchema,
  getSingleLocationSchema,
  updateLocationSchema,
  deleteLocationSchema,
} from "../schemas/location.schema";

const router = Router();

router.post(
  "/",
  protectRoute,
  validateSchema(createLocationSchema),
  createLocation,
);

router.get("/", protectRoute, validateSchema(getLocationsSchema), getLocations);
router.get(
  "/:locationId",
  protectRoute,
  validateSchema(getSingleLocationSchema),
  getSingleLocation,
);

router.patch(
  "/:locationId",
  protectRoute,
  validateSchema(updateLocationSchema),
  updateLocation,
);

router.delete(
  "/:locationId",
  protectRoute,
  validateSchema(deleteLocationSchema),
  deleteLocation,
);

export default router;
