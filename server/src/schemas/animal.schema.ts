import { z } from "zod";

const AnimalTypeEnum = z.enum(["Sow", "Boar"]);

export const createAnimalSchema = z
  .object({
    body: z.object({
      farmId: z.number({ error: "Farm ID is required" }),
      raceId: z.number({ error: "Race ID is required" }),
      tagNumber: z
        .string({ error: "Tag number is required" })
        .min(1, "Tag number cannot be empty")
        .max(50, "Tag number must be at most 50 characters"),
      type: AnimalTypeEnum,
      entryDate: z
        .string("Entry date is required")
        .date("Invalid date format, use YYYY-MM-DD"),
      bornDate: z
        .string()
        .date("Invalid date format, use YYYY-MM-DD")
        .optional(),
      parity: z.number().int().nonnegative().optional(),
      locationId: z.number().optional(),
      observation: z
        .string()
        .max(255, "Observation must be at most 255 characters")
        .optional(),
    }),
  })
  .refine(
    (data) => {
      if (!data.body.bornDate) return true;
      return new Date(data.body.bornDate) <= new Date(data.body.entryDate);
    },
    {
      message: "Born date cannot be grater than entry date.",
      path: ["body", "bornDate"],
    },
  );

export const getAnimalsSchema = z.object({
  query: z.object({
    farmId: z.coerce.number({ error: "Farm ID is required" }),
    type: AnimalTypeEnum.optional(),
    raceId: z.coerce.number().optional(),
    locationId: z.coerce.number().optional(),
    active: z.enum(["true", "false"]).optional(),
  }),
});

export const getSingleAnimalSchema = z.object({
  params: z.object({
    animalId: z.string({ error: "Animal ID is required in the URL" }),
  }),
  query: z.object({
    farmId: z.coerce.number({ error: "Farm ID is required" }),
  }),
});

export const updateAnimalSchema = z
  .object({
    params: z.object({
      animalId: z.string({ error: "Animal ID is required in the URL" }),
    }),
    body: z.object({
      farmId: z.number({ error: "Farm ID is required" }),
      raceId: z.number().optional(),
      tagNumber: z
        .string()
        .min(1, "Tag number cannot be empty")
        .max(50, "Tag number must be at most 50 characters")
        .optional(),
      entryDate: z
        .string()
        .date("Invalid date format, use YYYY-MM-DD")
        .optional(),
      bornDate: z
        .string()
        .date("Invalid date format, use YYYY-MM-DD")
        .optional(),
      parity: z.number().int().nonnegative().optional(),
      locationId: z.number().nullable().optional(),
      observation: z.string().nullable().optional(),
      active: z.boolean().optional(),
    }),
  })
  .refine(
    (data) => {
      if (!data.body.bornDate || !data.body.entryDate) return true;
      return new Date(data.body.bornDate) <= new Date(data.body.entryDate);
    },
    {
      message: "Born date cannot be greater than entry date.",
      path: ["body", "bornDate"],
    },
  );

export const deleteAnimalSchema = z.object({
  params: z.object({
    animalId: z.string({ error: "Animal ID is required in the URL" }),
  }),
  body: z.object({
    farmId: z.number({ error: "Farm ID is required" }),
  }),
});
