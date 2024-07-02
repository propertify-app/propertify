import "server-only"


import { getDb } from "@/db";
import { users } from "@/db/schema/users";

export const createUser = async (userId: string, clerkConnected: boolean) => {
  const db = getDb();
  await db
    .insert(users)
    .values({ id: userId, clerkConnected })
    .execute();
}