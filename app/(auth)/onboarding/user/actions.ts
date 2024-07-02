"use server"
import { getDb } from "@/db";
import { users } from "@/db/schema/users";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod"
import { onboardingUserSchema, OnboardingUserState } from "./schema";
import { redirect } from "next/navigation";



export async function completeOnboarding(prevState: OnboardingUserState, formData: FormData): Promise<OnboardingUserState> {
  const { userId } = await auth();

  const fields = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string
  };

  if (!userId) {
    return { message: "No Logged In User", fields };
  }

  const validatedFields = onboardingUserSchema.safeParse(fields);

  if (!validatedFields.success) {
    return {
      message: "",
      errors: validatedFields.error.issues.map((issue) => issue.message),
      fields
    };
  }

  try {
    const client = await clerkClient()
    await client.users.updateUser(userId, {
      firstName: validatedFields.data.firstName,
      lastName: validatedFields.data.lastName,
      publicMetadata: {
        onboardingStep: "company"
      }
    });

    return { success: true, message: "" }

  } catch (err) {
    console.error(err)
    return { message: "There was an error updating the user metadata.", fields };
  }
}