"use client"

import { useCallback, useState } from "react";
import {
  Sheet,
} from "@/components/ui/sheet"
import { useRouter } from "@/lib/hooks/use-router";


export default function InterceptSheet ({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const handleSheetStateChange = useCallback(() => {
    router.back();
  }, [router])

  return <Sheet defaultOpen={true} open={true} onOpenChange={handleSheetStateChange}>
    {children}
  </Sheet>
}