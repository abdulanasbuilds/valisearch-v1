export const runtime = 'edge';

// TODO: Add Stripe webhook integration here
export async function POST(request: Request) {
  const body = await request.text();
  
  // Verify Stripe signature here
  // const sig = request.headers.get('stripe-signature');
  
  return Response.json({ received: true });
}
