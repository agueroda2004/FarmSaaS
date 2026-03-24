// src/middlewares/validateMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { sendFail } from "../utils/apiResponse";

// Usamos ZodSchema, que es el tipo genérico universal para los esquemas
export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // safeParse evalúa los datos sin lanzar excepciones (adiós try/catch)
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Si la validación falla, result.success es false y Zod nos da los errores tipados
    if (!result.success) {
      const errorMessages = result.error.issues.map((err) => ({
        field: err.path[err.path.length - 1], // Obtiene el nombre del campo que falló
        message: err.message, // Obtiene el mensaje que definiste en el esquema
      }));

      sendFail(res, 400, "Validation failed", errorMessages);
      return;
    }

    // Si todo está perfecto, continuamos hacia el controlador
    next();
  };
};
