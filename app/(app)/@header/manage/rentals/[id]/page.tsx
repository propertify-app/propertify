import { HeaderBreadcrumbs } from "@/components/server/header-breadcrumbs"
import crumb from "../crumb"
import {getCrumb} from "./crumb"
import { HeaderActions } from "@/components/server/header-actions"
import RentalHeaderActions from "./actions"
import { redirect } from "next/navigation"

export const runtime = "edge"

export default async function RentalHeader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const crumb2 = await getCrumb({ id })//.catch(() => redirect("/manage/rentals"))
  const breadcrumbs = [
    crumb,
    crumb2
  ]
  return (
    <>
      <HeaderBreadcrumbs breadcrumbs={breadcrumbs} />
      <HeaderActions>
        <RentalHeaderActions />
      </HeaderActions>
    </>
  )
}