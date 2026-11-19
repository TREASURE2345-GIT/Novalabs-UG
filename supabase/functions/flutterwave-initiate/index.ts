import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { getAdminClient } from '../_shared/supabase.ts';

const PLAN_AMOUNTS: Record<string, number> = {
  monthly_premium: 15000,
  school: 500000,
};

const PLAN_LABELS: Record<string, string> = {
  monthly_premium: 'Monthly Premium',
  school: 'School',
};

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const authorization = request.headers.get('Authorization') ?? '';
    if (!authorization.startsWith('Bearer ')) {
      return jsonResponse({ error: 'Missing bearer token' }, 401);
    }

    const secretKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY');
    if (!secretKey) {
      return jsonResponse({ error: 'FLUTTERWAVE_SECRET_KEY is not configured' }, 500);
    }

    const admin = getAdminClient();
    const token = authorization.slice('Bearer '.length);
    const { data: authData, error: authError } = await admin.auth.getUser(token);

    if (authError || !authData.user) {
      return jsonResponse({ error: 'Invalid or expired session' }, 401);
    }

    const body = await request.json().catch(() => ({}));
    const plan = String(body.plan ?? '');

    if (!PLAN_AMOUNTS[plan]) {
      return jsonResponse({ error: 'plan must be monthly_premium or school' }, 400);
    }

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('name, email, school_id')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    const amount = PLAN_AMOUNTS[plan];
    const currency = 'UGX';
    const reference = `NOVALAB-${plan === 'school' ? 'SCHOOL' : 'PREMIUM'}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const origin = request.headers.get('origin') ?? '';
    const siteUrl = (Deno.env.get('SITE_URL') ?? origin ?? 'http://localhost:5187').replace(/\/$/, '');
    const redirectUrl = `${siteUrl}/subscription/callback`;
    const customerEmail = profile?.email ?? authData.user.email ?? '';
    const customerName = profile?.name ?? authData.user.user_metadata?.name ?? customerEmail.split('@')[0];

    if (!customerEmail) {
      return jsonResponse({ error: 'The signed-in account has no email address' }, 400);
    }

    const { error: insertError } = await admin.from('subscriptions').insert({
      user_id: authData.user.id,
      school_id: plan === 'school' ? profile?.school_id ?? null : null,
      plan,
      status: 'pending',
      amount,
      currency,
      reference,
      provider: 'flutterwave',
      metadata: { origin, customer_email: customerEmail },
    });

    if (insertError) throw insertError;

    const flutterwaveResponse = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: reference,
        amount,
        currency,
        redirect_url: redirectUrl,
        payment_options: 'card,mobilemoneyuganda,ussd',
        customer: { email: customerEmail, name: customerName },
        customizations: {
          title: 'NovaLab Subscription',
          description: `${PLAN_LABELS[plan]} Plan`,
          logo: `${siteUrl}/novalab-logo.png`,
        },
        meta: {
          user_id: authData.user.id,
          plan,
          reference,
        },
      }),
    });

    const flutterwaveJson = await flutterwaveResponse.json().catch(() => ({}));

    if (!flutterwaveResponse.ok || flutterwaveJson.status !== 'success' || !flutterwaveJson.data?.link) {
      await admin
        .from('subscriptions')
        .update({ status: 'cancelled', metadata: { origin, error: flutterwaveJson.message ?? 'checkout_failed' } })
        .eq('reference', reference);

      return jsonResponse(
        { error: flutterwaveJson.message ?? 'Flutterwave could not create a checkout link' },
        502,
      );
    }

    return jsonResponse({
      link: flutterwaveJson.data.link,
      reference,
      amount,
      currency,
      plan,
    });
  } catch (error) {
    console.error('flutterwave-initiate failed', error);
    return jsonResponse({ error: error instanceof Error ? error.message : 'Unexpected error' }, 500);
  }
});
