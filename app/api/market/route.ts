export const runtime = 'edge';

// TODO: Add market research integration here
export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ status: 'ok', message: 'ready', data: body });
}
