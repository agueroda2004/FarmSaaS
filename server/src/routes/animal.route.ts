import { Router } from "express";
import {
  createAnimal,
  deleteAnimal,
  getAnimals,
  getSingleAnimal,
  updateAnimal,
} from "../controllers/animal.controller";
import { protectRoute } from "../middlewares/authMiddleware";
import { validateSchema } from "../middlewares/validateMiddleware";
import {
  createAnimalSchema,
  deleteAnimalSchema,
  getAnimalsSchema,
  getSingleAnimalSchema,
  updateAnimalSchema,
} from "../schemas/animal.schema";

const router = Router();

router.post(
  "/",
  protectRoute,
  validateSchema(createAnimalSchema),
  createAnimal,
);
router.get("/", protectRoute, validateSchema(getAnimalsSchema), getAnimals);
router.get(
  "/:animalId",
  protectRoute,
  validateSchema(getSingleAnimalSchema),
  getSingleAnimal,
);
router.patch(
  "/:animalId",
  protectRoute,
  validateSchema(updateAnimalSchema),
  updateAnimal,
);
router.delete(
  "/:animalId",
  protectRoute,
  validateSchema(deleteAnimalSchema),
  deleteAnimal,
);

export default router;
