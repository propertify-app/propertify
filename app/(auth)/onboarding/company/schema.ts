import { z } from "zod";

export const onboardingCompanySchema = z.object({
  name: z.string({
    required_error: "First name is required",
    invalid_type_error: "Invalid first name"
  }).min(1, "First name cannot be empty")
})

export type OnboardingCompanyState = {
  errors?: string[];
  fields?: Record<string, string>;
  message: string;
  success?: boolean;
}
