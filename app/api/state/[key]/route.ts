import { getUserPreferences } from '@/lib/services/user-preferences';

export const runtime = 'edge';

export async function GET(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const key = (await params).key
  try {
    const preferences = await getUserPreferences()
    return new Response(JSON.stringify(preferences), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch state from D1:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch state' }), { status: 500 });
  }
}
