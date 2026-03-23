// src/routes/farmRoutes.ts
import { Router } from "express";
import { createFarm } from "../controllers/farm.controller";

const router = Router();

// Cuando alguien haga un POST a la ruta principal, ejecuta el controlador
router.post("/", createFarm);

export default router;
