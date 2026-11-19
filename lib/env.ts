import { z } from 'zod';

const EnvSchema = z.object({
  VITE_APP_NAME: z.string().min(1),
  VITE_API_URL: z.string().url(),
  VITE_SITE_URL: z.string().url(),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(20),
  VITE_FLUTTERWAVE_PUBLIC_KEY: z.string().startsWith('FLWPUBK_'),
  VITE_ENABLE_OFFLINE_MODE: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true'),
  VITE_GOOGLE_CLIENT_ID: z.string().optional(),
  VITE_GEMINI_API_KEY: z.string().optional(),
  VITE_GEMINI_MODEL: z.string().optional(),
  VITE_YOUTUBE_API_KEY: z.string().optional(),
});

type Env = z.infer<typeof EnvSchema>;

const readRawEnv = (): Record<string, unknown> =>
  Object.fromEntries(
    Object.keys(EnvSchema.shape).map((key) => [key, import.meta.env[key as keyof ImportMetaEnv]]),
  );

function loadEnv(): Env {
  const raw = readRawEnv();
  const parsed = EnvSchema.safeParse(raw);

  if (parsed.success) {
    return parsed.data;
  }

  const invalidKeys = Object.keys(parsed.error.flatten().fieldErrors);
  const isTestEnv = import.meta.env.MODE === 'test'
    || Boolean((import.meta.env as Record<string, unknown>).VITEST);
  if (!isTestEnv) {
    console.error('[env] Invalid or missing variables:', invalidKeys);
  }

  return {
    ...raw,
    VITE_APP_NAME: (raw.VITE_APP_NAME as string) || 'NovaLab',
    VITE_API_URL: (raw.VITE_API_URL as string) || 'http://localhost:3000/api',
    VITE_SITE_URL: (raw.VITE_SITE_URL as string) || 'http://localhost:5187',
    VITE_SUPABASE_URL: (raw.VITE_SUPABASE_URL as string) || '',
    VITE_SUPABASE_ANON_KEY: (raw.VITE_SUPABASE_ANON_KEY as string) || '',
    VITE_FLUTTERWAVE_PUBLIC_KEY: (raw.VITE_FLUTTERWAVE_PUBLIC_KEY as string) || 'FLWPUBK_TEST-xxxx',
    VITE_ENABLE_OFFLINE_MODE: raw.VITE_ENABLE_OFFLINE_MODE !== 'false',
    VITE_GOOGLE_CLIENT_ID: (raw.VITE_GOOGLE_CLIENT_ID as string) || '',
    VITE_GEMINI_API_KEY: (raw.VITE_GEMINI_API_KEY as string) || '',
    VITE_GEMINI_MODEL: (raw.VITE_GEMINI_MODEL as string) || 'gemini-2.5-flash',
    VITE_YOUTUBE_API_KEY: (raw.VITE_YOUTUBE_API_KEY as string) || '',
  } as Env;
}

export const env = loadEnv();

const isPlaceholderValue = (value: string) =>
  !value ||
  value.includes('your-project') ||
  value.includes('placeholder') ||
  value === 'your-anon-key';

export const isSupabaseConfigured = Boolean(
  env.VITE_SUPABASE_URL &&
    env.VITE_SUPABASE_ANON_KEY &&
    !isPlaceholderValue(env.VITE_SUPABASE_URL) &&
    !isPlaceholderValue(env.VITE_SUPABASE_ANON_KEY),
);
