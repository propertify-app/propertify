import RentalList from "@/components/client/rentals/rental-list";
import { getCachedActiveCompany } from "@/lib/services/company/get-active-company";
import { getQueryClient } from "@/lib/trpc-query/get-query-client";
import { trpc } from "@/lib/trpc-query/server";
export const runtime = 'edge';

export default async function Rentals() {

  // const queryClient = getQueryClient();

  // const queries = [
  //   queryClient.prefetchQuery({
  //     queryKey: ['rentals', 'getRentals', getCachedActiveCompany()],
  //     queryFn: () => trpc.rentals.getRentals(),
  //   })
  // ];

  // await Promise.all(queries);

  return (
    <RentalList page="rental"/>
  );
}
