import type { AppRouter } from "@/lib/trpc";
import { createTRPCClient, createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { getUrl } from "./get-query-client";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getUrl()
    })
  ]
});
