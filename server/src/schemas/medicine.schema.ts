import { z } from "zod";

export const createMedicineSchema = z.object({
  body: z.object({
    farmId: z.number({ error: "Farm ID is required" }),
    name: z
      .string("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),
  }),
});

export const getMedicinesSchema = z.object({
  query: z.object({
    farmId: z.coerce.number({ error: "Farm ID is required" }),
    active: z.enum(["true", "false"]).optional(),
  }),
});

export const getSingleMedicineSchema = z.object({
  params: z.object({
    medicineId: z.string("Medicine ID is required in the URL"),
  }),
  query: z.object({
    farmId: z.coerce.number({ error: "Farm ID is required" }),
  }),
});

export const updateMedicineSchema = z.object({
  params: z.object({
    medicineId: z.string({ error: "Medicine ID is required in the URL" }),
  }),
  body: z.object({
    farmId: z.number({ error: "Farm ID is required" }),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 character")
      .optional(),
    active: z.boolean().optional(),
  }),
});

export const deleteMedicineSchema = z.object({
  params: z.object({
    medicineId: z.string({ error: "Medicine ID is required in the URL" }),
  }),
  body: z.object({
    farmId: z.number({ error: "Farm ID is required" }),
  }),
});
