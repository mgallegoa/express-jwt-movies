import { z } from "zod";

const movieSchema = z.object({
  title: z.string({
    required_error: "The movie title is required",
    invalid_type_error: "The movie title most be a valid string",
  }),
  year: z.number().int().min(1900).max(2026),
  director: z.string({
    required_error: "The name of director is required",
    invalid_type_error: "The name of director most be a valid string",
  }),
  duration: z.number().int().positive(),
  poster: z.string().url({
    message: "The movie poster must be a valid URL",
  }),
  genre: z.array(
    z.enum(["Drama", "Action", "Crime", "Adventure", "Sci-Fi", "Romance"]),
    {
      required_error: "The genre is required",
      invalid_type_error: "The genre must be valid",
    },
  ),
  rate: z.number().min(0).max(10).default(5),
  password: z.string().optional(),
  confirm: z.string().optional(),
});

export function validateMovie(input) {
  return movieSchema.safeParse(input);
}

export function validatePartialMovie(input) {
  return movieSchema.partial().safeParse(input);
}
