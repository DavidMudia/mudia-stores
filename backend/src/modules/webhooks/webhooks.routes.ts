import { Elysia } from 'elysia';
import Stripe from 'stripe';
import { prisma } from '../../db/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const webhookRoutes = new Elysia({ prefix: '/webhooks' })
  .post(
    '/stripe',
    async ({ request, set }) => {
      const rawBody = await request.arrayBuffer();
      const sig = request.headers.get('stripe-signature');

      if (!sig) {
        set.status = 400;
        return { error: 'Missing stripe-signature header' };
      }

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(
          Buffer.from(rawBody),
          sig,
          process.env.STRIPE_WEBHOOK_SECRET!
        );
      } catch (err) {
        // ✅ Narrow the error type
        const errorMessage = err instanceof Error ? err.message : 'Unknown webhook error';
        set.status = 400;
        return { error: `Webhook Error: ${errorMessage}` };
      }

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const orderId = paymentIntent.metadata?.orderId;
          if (orderId) {
            await prisma.order.update({
              where: { id: orderId },
              data: { status: 'processing' },
            });
            console.log(`✅ Order ${orderId} marked as processing`);
          } else {
            console.log('⚠️ PaymentIntent succeeded but no orderId in metadata');
          }
          break;
        }
        case 'payment_intent.payment_failed': {
          // Optionally mark order as failed or cancelled
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const orderId = paymentIntent.metadata?.orderId;
          if (orderId) {
            await prisma.order.update({
              where: { id: orderId },
              data: { status: 'cancelled' },
            });
            console.log(`❌ Order ${orderId} marked as cancelled due to payment failure`);
          }
          break;
        }
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    },
    {
      // Skip JSON parsing for raw body
      parse: ({ request }) => request.arrayBuffer(),
    }
  );