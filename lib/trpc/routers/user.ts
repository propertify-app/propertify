import { getUserPreferences, setUserPreferences, userPreferencesSchema } from '@/lib/services/user-preferences';
import { t } from '@/lib/trpc/trpc';
import { z } from 'zod';

export const userRouter = t.router({
  getPreferences: t.procedure.query(async (opts) => {
    return getUserPreferences(opts.ctx.userId)
  }),
  setPreferences: t.procedure.input(userPreferencesSchema).mutation(async (opts) => {
    await setUserPreferences(opts.input, opts.ctx.userId)
  })
});
