import EditRentalClient from "./client";

export default async function EditRental({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div className="flex flex-col max-w-screen-md w-full self-center px-4 py-8">
    <EditRentalClient id={id} />
  </div>;
}
