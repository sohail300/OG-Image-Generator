import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "The title should have 1-100 characters.")
    .max(100, "The title should have 1-100 characters."),
  description: z
    .string()
    .min(1, "The title should have 1-10,000 characters.")
    .max(10000, "The title should have 1-10,000 characters."),
  photo: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `File size must be less than or equal to 10 MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png, .webp, and .gif formats are supported."
    )
    .optional(),
});

export type postType = z.infer<typeof postSchema>;
