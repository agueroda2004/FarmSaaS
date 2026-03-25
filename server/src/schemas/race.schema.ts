import { z } from "zod";

/* =============================
   Create Race Schema
   =============================*/
export const createRaceSchema = z.object({
  body: z.object({
    farmId: z.number({ error: "Farm ID is required" }),
    name: z
      .string("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),
  }),
});

/* =============================
   Update Race Schema
   =============================*/
export const updateRaceSchema = z.object({
  params: z.object({
    raceId: z.string("Race ID is required in the URL"),
  }),
  body: z.object({
    farmId: z.number({ error: "Farm ID is required" }),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters")
      .optional(),
    active: z.boolean().optional(),
  }),
});

/* =============================
   Delete Race Schema
   =============================*/
export const deleteRaceSchema = z.object({
  params: z.object({
    raceId: z.string("Race ID is required in the URL"),
  }),
  body: z.object({
    farmId: z.number({ error: "Farm ID is required" }),
  }),
});

/* =============================
   Get Races Schema
   coerce.number(): Trasnform the input to a number if possible, and validate it as a number.
   =============================*/
export const getRacesSchema = z.object({
  query: z.object({
    farmId: z.coerce.number({
      error: "Farm ID is required",
    }),
  }),
});

/* =============================
   Get Single Race Schema
   coerce.number(): Trasnform the input to a number if possible, and validate it as a number.
   =============================*/
export const getSingleRaceSchema = z.object({
  params: z.object({
    raceId: z.string("Race ID is required in the URL"),
  }),
  query: z.object({
    farmId: z.coerce.number({
      error: "Farm ID is required",
    }),
  }),
});
