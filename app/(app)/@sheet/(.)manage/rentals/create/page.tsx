import { RentalForm } from "@/app/(app)/manage/rentals/create/rental-form"
import InterceptSheet from "@/components/client/intercept-sheet"

export const runtime = "edge"

export default function CreateRentalSheet() {
  return (
    <InterceptSheet>        
      <RentalForm />
    </InterceptSheet>

  )
}