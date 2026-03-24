import { Router } from "express";
import {
  createEmployeeUser,
  deleteEmployeeUser,
  updateEmployeeUser,
} from "../controllers/user.controller";
import { protectRoute } from "../middlewares/authMiddleware";
import { validateSchema } from "../middlewares/validateMiddleware";
import {
  createUserSchema,
  deleteUserSchema,
  updateUserSchema,
} from "../schemas/user.schema";

const router = Router();

router.post(
  "/",
  protectRoute,
  validateSchema(createUserSchema),
  createEmployeeUser,
);

router.patch(
  "/:userId",
  protectRoute,
  validateSchema(updateUserSchema),
  updateEmployeeUser,
);

router.delete(
  "/:userId",
  protectRoute,
  validateSchema(deleteUserSchema),
  deleteEmployeeUser,
);

export default router;
