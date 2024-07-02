import { auth } from "@clerk/nextjs/server";

const authOrThrow = async () => {
  const user = await auth();
  if (!user.userId) {
    throw new Error("Unauthenticated");
  }
  return user;
};

export default authOrThrow