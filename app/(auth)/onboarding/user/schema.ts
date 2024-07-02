import { z } from "zod";

export const onboardingUserSchema = z.object({
  firstName: z.string({
    required_error: "First name is required",
    invalid_type_error: "Invalid first name"
  }).min(1, "First name cannot be empty"),
  lastName: z.string({
    required_error: "Last name is required",
    invalid_type_error: "Invalid last name"
  }).min(1, "Last name cannot be empty")
})

export type OnboardingUserState = {
  errors?: string[];
  fields?: {
    firstName: string;
    lastName: string;
  };
  message: string;
  success?: boolean;
}
