import { email, z } from "zod";

/* =============================
   Create User Schema
   =============================*/
export const createUserSchema = z.object({
  body: z.object({
    email: z.string("Email is required").email("Invalid email format"),
    name: z
      .string("Name is required")
      .min(2, "Name must be at least 2 characters"),
    password: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters"),
    farmId: z.number({ error: "Farm ID is required" }),
    role: z.enum(["User", "Owner", "Administrator", "Veterinarian"]).optional(),
  }),
});

/* =============================
   Update User Schema
   =============================*/
export const updateUserSchema = z.object({
  params: z.object({
    userId: z.string("User ID is required in the URL"),
  }),
  body: z.object({
    farmId: z.number({ error: "Farm ID is required" }),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email format").optional(),
    role: z.enum(["User", "Owner", "Administrator", "Veterinarian"]).optional(),
    active: z.boolean().optional(),
  }),
});

/* =============================
   Delete User Schema
   =============================*/
export const deleteUserSchema = z.object({
  params: z.object({
    userId: z.string("User ID is required in the URL"),
  }),
  body: z.object({
    farmId: z.number({ error: "Farm ID is required" }),
  }),
});
