"use server"
import { getDb } from "@/db";
import { users } from "@/db/schema/users";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod"
import { onboardingCompanySchema, OnboardingCompanyState } from "./schema";
import { redirect } from "next/navigation";
import { company, userCompanyAccess } from "@/db/schema/company";



export async function completeOnboarding(prevState: OnboardingCompanyState, data: FormData): Promise<OnboardingCompanyState> {
  const { userId } = await auth();

  const formData = Object.fromEntries(data);


  if (!userId) {
    return { message: "No Logged In User" };
  }

  const validatedFields = onboardingCompanySchema.safeParse(formData);

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      message: "",
      errors: validatedFields.error.issues.map((issue) => issue.message),
      fields
    };
  }

  try {
    const db = getDb();
    const [newCompany] = await db
      .insert(company)
      .values({ name: validatedFields.data.name })
      .returning({ id: company.id });

    await db
      .insert(userCompanyAccess)
      .values({
        userId: userId,
        companyId: newCompany.id
      })
      .execute();

    await (await clerkClient()).users.updateUser(userId, {
      publicMetadata: {
        onboardingStep: "complete"
      }
    });

    return { success: true, message: "" }

  } catch (err) {
    console.error(err)
    return { message: "There was an error updating the user metadata."};
  }
}