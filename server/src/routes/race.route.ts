import { Router } from "express";
import {
  createRace,
  getRaces,
  updateRace,
  deleteRace,
  getSingleRace,
} from "../controllers/race.controller";
import { protectRoute } from "../middlewares/authMiddleware";
import { validateSchema } from "../middlewares/validateMiddleware";
import {
  createRaceSchema,
  getRacesSchema,
  updateRaceSchema,
  deleteRaceSchema,
  getSingleRaceSchema,
} from "../schemas/race.schema";

const router = Router();

router.post("/", protectRoute, validateSchema(createRaceSchema), createRace);
router.get("/", protectRoute, validateSchema(getRacesSchema), getRaces);
router.get(
  "/:raceId",
  protectRoute,
  validateSchema(getSingleRaceSchema),
  getSingleRace,
);
router.patch(
  "/:raceId",
  protectRoute,
  validateSchema(updateRaceSchema),
  updateRace,
);
router.delete(
  "/:raceId",
  protectRoute,
  validateSchema(deleteRaceSchema),
  deleteRace,
);

export default router;
