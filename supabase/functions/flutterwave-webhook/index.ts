import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { getAdminClient } from '../_shared/supabase.ts';

type FlutterwaveWebhook = {
  event?: string;
  data?: {
    id?: number | string;
    tx_ref?: string;
    status?: string;
    amount?: number;
    currency?: string;
  };
};

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const secretHash = Deno.env.get('FLUTTERWAVE_WEBHOOK_HASH');
    const signature = request.headers.get('verif-hash');

    if (!secretHash) {
      return jsonResponse({ error: 'FLUTTERWAVE_WEBHOOK_HASH is not configured' }, 500);
    }

    if (!signature || signature !== secretHash) {
      return new Response('Invalid signature', { status: 401 });
    }

    const payload = (await request.json().catch(() => ({}))) as FlutterwaveWebhook;

    if (payload.event !== 'charge.completed' || payload.data?.status !== 'successful') {
      return jsonResponse({ status: 'ignored', event: payload.event ?? null });
    }

    const transactionId = payload.data?.id;
    const reference = payload.data?.tx_ref;

    if (!transactionId || !reference) {
      return jsonResponse({ status: 'ignored', reason: 'missing transaction id or reference' });
    }

    const secretKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY');
    if (!secretKey) {
      return jsonResponse({ error: 'FLUTTERWAVE_SECRET_KEY is not configured' }, 500);
    }

    const admin = getAdminClient();

    const { data: subscription, error: subscriptionError } = await admin
      .from('subscriptions')
      .select('id, plan, amount, currency, status, reference')
      .eq('reference', reference)
      .maybeSingle();

    if (subscriptionError) throw subscriptionError;

    if (!subscription) {
      return jsonResponse({ status: 'ignored', reason: 'unknown reference' });
    }

    if (subscription.status === 'active') {
      return jsonResponse({ status: 'ok', reference, already_active: true });
    }

    const verifyResponse = await fetch(
      `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(String(transactionId))}/verify`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const verifyJson = await verifyResponse.json().catch(() => ({}));
    const transaction = verifyJson.data;

    if (
      !verifyResponse.ok ||
      verifyJson.status !== 'success' ||
      !transaction ||
      transaction.status !== 'successful'
    ) {
      return jsonResponse({ status: 'pending', reason: 'transaction not verified' }, 202);
    }

    if (transaction.tx_ref !== reference) {
      return jsonResponse({ status: 'ignored', reason: 'reference mismatch' });
    }

    if (String(transaction.currency).toUpperCase() !== String(subscription.currency).toUpperCase()) {
      return jsonResponse({ status: 'ignored', reason: 'currency mismatch' });
    }

    if (Number(transaction.amount) + 0.01 < Number(subscription.amount)) {
      return jsonResponse({ status: 'ignored', reason: 'amount mismatch' });
    }

    const { error: activateError } = await admin.rpc('activate_subscription', {
      p_reference: reference,
      p_transaction_id: String(transaction.id),
    });

    if (activateError) throw activateError;

    return jsonResponse({
      status: 'ok',
      reference,
      plan: subscription.plan,
      transaction_id: String(transaction.id),
    });
  } catch (error) {
    console.error('flutterwave-webhook failed', error);
    return jsonResponse({ error: error instanceof Error ? error.message : 'Unexpected error' }, 500);
  }
});
