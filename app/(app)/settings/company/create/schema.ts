import { z } from "zod";

export const createCompanyFormSchema = z.object({
  name: z.string({
    required_error: "Company name is required",
    invalid_type_error: "Invalid company name"
  }).min(1, "Company name cannot be empty")
})
