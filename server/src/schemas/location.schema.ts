import { z } from "zod";

/* =============================
   Location Type Enum
   =============================*/
const LocationTypeEnum = z.enum([
  "Gestation",
  "Farrowing",
  "Nursey",
  "Fattening",
  "Quarantine",
  "Hospital",
]);

/* =============================
   Create Location Schema
   =============================*/
export const createLocationSchema = z.object({
  body: z.object({
    farmId: z.number({ error: "Farm ID is required" }),
    name: z
      .string("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),
    type: LocationTypeEnum,
    capacity: z.number().int().positive().optional(),
    observation: z.string().optional(),
  }),
});

/* =============================
   Get Location Schema || Get Location by type Schema
   =============================*/
export const getLocationsSchema = z.object({
  query: z.object({
    farmId: z.coerce.number({ error: "Farm ID is required" }),
    type: LocationTypeEnum.optional(),
  }),
});

/* =============================
   Get Single Location Schema
   =============================*/
export const getSingleLocationSchema = z.object({
  params: z.object({
    locationId: z.string("Location ID is required in the URL"),
  }),
  query: z.object({
    farmId: z.coerce.number({ error: "Farm ID is required" }),
  }),
});

/* =============================
   Update Location Schema
   =============================*/
export const updateLocationSchema = z.object({
  params: z.object({
    locationId: z.string("Location ID is required in the URL"),
  }),
  body: z.object({
    farmId: z.number({ error: "Farm ID is required" }),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters")
      .optional(),
    type: LocationTypeEnum.optional(),
    capacity: z.number().int().positive().optional(),
    observation: z.string().optional(),
    active: z.boolean().optional(),
  }),
});

/* =============================
   Delete Location Schema
   =============================*/
export const deleteLocationSchema = z.object({
  params: z.object({
    locationId: z.string("Location ID is required in the URL"),
  }),
  body: z.object({
    farmId: z.number({ error: "Farm ID is required" }),
  }),
});
