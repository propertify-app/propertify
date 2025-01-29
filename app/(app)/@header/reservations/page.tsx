import { HeaderBreadcrumbs } from "@/components/server/header-breadcrumbs";

import crumb from "./crumb";

export const runtime = 'edge';

export default function Reservations() {
  const breadcrumbs = [crumb];
  return (
    <>
      <HeaderBreadcrumbs breadcrumbs={breadcrumbs} />
    </>
  );
}
