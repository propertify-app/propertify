// Generated by Wrangler by running `wrangler types --env-interface CloudflareEnv env.d.ts`

interface CloudflareEnv {
	CACHE_TAG_STORE: KVNamespace;
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_ZWFnZXItc3RvcmstNC5jbGVyay5hY2NvdW50cy5kZXYk";
	CLERK_SECRET_KEY: "sk_test_lfUS3njn3cZG95g1RNHEFgixA752GQWi0RRF7JNNkx";
	NEXT_PUBLIC_CLERK_SIGN_IN_URL: "/sign-in";
	NEXT_PUBLIC_CLERK_SIGN_UP_URL: "/sign-up";
	CLOUDFLARE_ACCOUNT_ID: "7c2c4324e1874b4a89953dc9327f7c0c";
	CLOUDFLARE_DATABASE_ID: "caf6de7e-a2ea-4e7d-b809-9c7d4f044306";
	CLOUDFLARE_D1_TOKEN: "Sgt_g2nETdKHUHW-9S4yW-yDP2Wza-oyn4fsEBg4";
	WEBHOOK_SECRET: "whsec_cCYZRJm6P1+GrrLuo7pqTXwzzjP9JFe3";
	NEXT_PUBLIC_APP_URL: "http://localhost:8788";
	IMAGES: R2Bucket;
	DB: D1Database;
}
