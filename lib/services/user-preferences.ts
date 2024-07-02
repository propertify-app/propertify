import "server-only"

import { getValue, setValue } from './state';
import { z } from 'zod';

const PREFERENCES_KEY = 'user_preferences';

export const userPreferencesSchema = z.object({
  sidebarOpen: z.boolean()
})

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  return await getValue(PREFERENCES_KEY, userId);
}

export async function setUserPreferences(
  preferences: UserPreferences,
  userId: string
): Promise<boolean> {
  return await setValue(PREFERENCES_KEY, preferences, userId);
}
