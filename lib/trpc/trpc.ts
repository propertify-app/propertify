import { initTRPC, TRPCError } from '@trpc/server';
import { QueryContext } from './context';
import { experimental_nextAppDirCaller } from '@trpc/server/adapters/next-app-dir';
import { auth } from '@clerk/nextjs/server';

interface Meta {
  span: string;
}

export const t = initTRPC.context<QueryContext>().create()
export const ta = initTRPC.meta<Meta>().create()

export const serverActionProcedure = ta.procedure.experimental_caller(
  experimental_nextAppDirCaller({})
).use(async (opts) => {
  const user = await auth();
  return opts.next({ctx: {user}})
})

export const protectedAction = serverActionProcedure.use((opts) => {
  if(!opts.ctx.user.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED"
    })
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      user: opts.ctx.user
    }
  })
})