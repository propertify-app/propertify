import CreateCompanyForm from "@/app/(app)/settings/company/create/create-company-form";
import InterceptModal from "@/components/client/intercept-modal";

export const runtime = "edge"

export default function CreateCompanyModal() {
  return <InterceptModal title={"Create company"}>
    <CreateCompanyForm/>
  </InterceptModal>
}