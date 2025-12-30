import { z } from "zod";


export const updateProfileValidationZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  picture: z
    .any()
    .optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileValidationZodSchema>;
