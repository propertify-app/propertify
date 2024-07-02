"use client"

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";


export default function InterceptModal ({
  children,
  title,
  description
}: {
  children: React.ReactNode
  title: string | React.ReactNode
  description?: string
}) {

  const router = useRouter()
  const handleModalStateChange = useCallback(() => {
    router.back();
  }, [router])

  return <Dialog defaultOpen={true} open={true} onOpenChange={handleModalStateChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      {children}
    </DialogContent>
  </Dialog>
}