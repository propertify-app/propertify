import { Config, defineConfig } from 'drizzle-kit';
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

const localConfig = (url: string): Partial<Config> => {
  return {
      dbCredentials: {
          url,
      },
  };
};

const cloudConfig: Partial<Config> = {
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_API_TOKEN!,
  },
};

export default defineConfig({
  schema: './db/schema/*',
  out: './db/migrations',
  dialect: "sqlite",
  strict: true,
  verbose: true,
  ...(process.env.CLOUDFLARE_D1_LOCAL_URL ? localConfig(process.env.CLOUDFLARE_D1_LOCAL_URL) : cloudConfig),
});