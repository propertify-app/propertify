import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/lib/trpc";
import { createQueryContext } from "@/lib/trpc/context";

export const runtime = "edge"

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createQueryContext,
  });

export { handler as GET, handler as POST };