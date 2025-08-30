import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name too short, minimum 2 characters" })
    .max(50, { message: "Name too long, maximum 50 characters" }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/(?=.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
      message: "Password must contain at least one special character",
    }),
  phone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Invalid Bangladeshi phone number",
    })
    .optional(),

  address: z.string().optional(),
});


export const updateUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name too short, minimum 2 characters" })
    .max(50, { message: "Name too long, maximum 50 characters" })
    .optional(),
  phone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Invalid Bangladeshi phone number",
    })
    .optional(),

  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z
    .boolean({ message: "isDeleted must be true or false" })
    .optional(),
  isVerified: z
    .boolean({ message: "isVerified must be true or false" })
    .optional(),
  address: z.string().optional(),
});
