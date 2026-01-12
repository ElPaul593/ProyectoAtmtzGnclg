import { z } from 'zod';

/**
 * Variables de CLIENTE (públicas, expuestas al navegador)
 * Prefijo obligatorio: NEXT_PUBLIC_
 */
const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1).default(''),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).default(''),
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string().default(''),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().default('http://localhost:3000'),
});

/**
 * Variables de SERVIDOR (secretas, nunca expuestas al cliente)
 */
const serverSchema = z.object({
  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  
  // PayPal
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  PAYPAL_WEBHOOK_ID: z.string().optional(),
  PAYPAL_MODE: z.enum(['sandbox', 'live']).default('sandbox'),
  
  // Google Calendar
  GOOGLE_CLIENT_EMAIL: z.string().email().optional(),
  GOOGLE_PRIVATE_KEY: z.string().optional(),
  GOOGLE_CALENDAR_ID: z.string().optional(),
  
  // Admin
  ADMIN_API_KEY: z.string().optional(),
  
  // AI
  OPENAI_API_KEY: z.string().optional(),
});

// Parse client env (siempre disponible, usa defaults si faltan)
let clientEnv: z.infer<typeof clientSchema>;
try {
  clientEnv = clientSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });
} catch (error) {
  console.warn('⚠️ Algunas variables de cliente están incompletas, usando defaults');
  clientEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  };
}

// Parse server env (sin lanzar errores en build)
const serverEnv = serverSchema.parse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
  PAYPAL_WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID,
  PAYPAL_MODE: process.env.PAYPAL_MODE || 'sandbox',
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
  GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID,
  ADMIN_API_KEY: process.env.ADMIN_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
});

/**
 * Env públicas (cliente)
 * Pueden usarse en componentes React
 */
export const env = {
  ...clientEnv,
} as const;

/**
 * Helper para verificar si una variable de servidor existe
 */
function requireServerEnv<K extends keyof typeof serverEnv>(
  key: K,
  context: string
): NonNullable<(typeof serverEnv)[K]> {
  const value = serverEnv[key];
  if (!value || value === '') {
    throw new Error(
      `❌ Variable de entorno requerida no configurada: ${key}\n` +
      `Contexto: ${context}\n` +
      `Esta variable debe configurarse en Vercel antes de usar esta funcionalidad.`
    );
  }
  return value as NonNullable<(typeof serverEnv)[K]>;
}

/**
 * Getters para variables de servidor (solo usar en server-side)
 * Lanzan error descriptivo si no están configuradas
 */
export const serverEnvRequired = {
  supabaseServiceRoleKey: (context = 'Supabase admin operations') =>
    requireServerEnv('SUPABASE_SERVICE_ROLE_KEY', context),
  
  paypalClientSecret: (context = 'PayPal API') =>
    requireServerEnv('PAYPAL_CLIENT_SECRET', context),
  
  paypalWebhookId: (context = 'PayPal webhook verification') =>
    requireServerEnv('PAYPAL_WEBHOOK_ID', context),
  
  googlePrivateKey: (context = 'Google Calendar API') =>
    requireServerEnv('GOOGLE_PRIVATE_KEY', context),
  
  googleClientEmail: (context = 'Google Calendar API') =>
    requireServerEnv('GOOGLE_CLIENT_EMAIL', context),
  
  googleCalendarId: (context = 'Google Calendar API') =>
    requireServerEnv('GOOGLE_CALENDAR_ID', context),
  
  adminApiKey: (context = 'Admin API') =>
    requireServerEnv('ADMIN_API_KEY', context),
  
  openaiApiKey: (context = 'OpenAI API') =>
    requireServerEnv('OPENAI_API_KEY', context),
};

/**
 * Getters opcionales (devuelven string | undefined sin lanzar error)
 */
export const serverEnvOptional = {
  paypalWebhookId: () => serverEnv.PAYPAL_WEBHOOK_ID,
  paypalMode: () => serverEnv.PAYPAL_MODE,
  paypalClientSecret: () => serverEnv.PAYPAL_CLIENT_SECRET,
};

/**
 * Helper para verificar si las credenciales de PayPal están configuradas
 */
export function isPayPalConfigured(): boolean {
  return !!(
    env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
    serverEnv.PAYPAL_CLIENT_SECRET
  );
}

/**
 * Helper para verificar si el webhook de PayPal está configurado
 */
export function isPayPalWebhookConfigured(): boolean {
  return !!(
    isPayPalConfigured() &&
    serverEnv.PAYPAL_WEBHOOK_ID
  );
}

/**
 * Helper para verificar si Supabase está configurado
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    env.NEXT_PUBLIC_SUPABASE_URL &&
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Helper para verificar si Google Calendar está configurado
 */
export function isGoogleCalendarConfigured(): boolean {
  return !!(
    serverEnv.GOOGLE_CLIENT_EMAIL &&
    serverEnv.GOOGLE_PRIVATE_KEY &&
    serverEnv.GOOGLE_CALENDAR_ID
  );
}
