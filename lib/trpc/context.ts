import { auth } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { cache } from 'react';
export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  const user = await auth()
  return { req, resHeaders, user };
}
export type Context = Awaited<ReturnType<typeof createContext>>;

export const createQueryContext = cache(async () => {
  const { userId } = await auth()
  if(!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED"
    })
  }
  return { userId };
});

export type QueryContext = Awaited<ReturnType<typeof createQueryContext>>;
