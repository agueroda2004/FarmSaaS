import { Router } from "express";
import {
  createMedicine,
  getMedicines,
  getSingleMedicine,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicine.controller";
import { protectRoute } from "../middlewares/authMiddleware";
import { validateSchema } from "../middlewares/validateMiddleware";
import {
  createMedicineSchema,
  getMedicinesSchema,
  getSingleMedicineSchema,
  updateMedicineSchema,
  deleteMedicineSchema,
} from "../schemas/medicine.schema";

const router = Router();

router.post(
  "/",
  protectRoute,
  validateSchema(createMedicineSchema),
  createMedicine,
);

router.get("/", protectRoute, validateSchema(getMedicinesSchema), getMedicines);

router.get(
  "/:medicineId",
  protectRoute,
  validateSchema(getSingleMedicineSchema),
  getSingleMedicine,
);

router.patch(
  "/:medicineId",
  protectRoute,
  validateSchema(updateMedicineSchema),
  updateMedicine,
);

router.delete(
  "/:medicineId",
  protectRoute,
  validateSchema(deleteMedicineSchema),
  deleteMedicine,
);

export default router;
