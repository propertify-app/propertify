import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function RootLayout(
  {
    children,
  }: {
    children: React.ReactNode;
  }
) {

  return <main className="flex flex-1 gap-8 flex-col items-center justify-center">{children}</main>;
}