import { getCompanies } from "@/lib/services/company";

export const runtime = 'edge';

export const GET = async () => {
  try {
    const companies = await getCompanies()
    return new Response(JSON.stringify(companies), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch comapies' }), { status: 500 });
  }
}