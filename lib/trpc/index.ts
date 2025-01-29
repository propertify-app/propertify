import { z } from 'zod';
import { companyRouter } from '@/lib/trpc/routers/company';
import { t } from '@/lib/trpc/trpc';
import { userRouter } from '@/lib/trpc/routers/user';
import { rentalRouter } from './routers/rentals';
import { addressRouter } from './routers/address';

export const appRouter = t.router({
  getUserById: t.procedure.input(z.string()).query((opts) => {
    return opts.ctx.userId; // input type is string
  }),
  address: addressRouter,
  company: companyRouter,
  user: userRouter,
  rentals: rentalRouter
});

export const createCallerFactory = t.createCallerFactory;
// export type definition of API
export type AppRouter = typeof appRouter;