// "use server";

// import { db } from "@/lib/db";
// import { rentals } from "@/lib/db/schema";
// import { revalidatePath } from "next/cache";

// export async function createDefaultRental() {
//   try {
//     await db.insert(rentals).values({
//       name: "Default Rental",
//       description: "This is a default rental description.",
//       price: 100,
//       location: "Default Location",
//       available: true,
//     });

//     revalidatePath("/manage/rentals");
//   } catch (error) {
//     console.error("Failed to create default rental:", error);
//     throw new Error("Failed to create default rental");
//   }
// }
