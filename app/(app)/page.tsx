export const runtime = "edge";

import { Button } from "@/components/ui/button";
import { revalidateTag } from "@/lib/cache";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  return (
    <main className="flex flex-col">
      <Button onClick={async () => {
        "use server"
        const { userId } = await auth()
        revalidateTag(`company-${userId}`)
      }}>Revalidate</Button>
    </main>
  );
}
