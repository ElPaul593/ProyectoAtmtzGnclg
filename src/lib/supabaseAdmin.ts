import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from './logger';

export interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  service_id: string;
  start_at: string;
  end_at: string;
  status: 'PENDING' | 'CONFIRMED' | 'AWAITING_TRANSFER' | 'CANCELLED' | 'COMPLETED';
  payment_method: 'PAYPAL' | 'TRANSFER';
  paypal_order_id?: string;
  transfer_reference?: string;
  calendar_event_id?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

let supabaseAdminInstance: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (supabaseAdminInstance) {
    return supabaseAdminInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    // Durante el build, no lanzar error, solo advertir
    if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'preview') {
      logger.warn('Supabase credentials not configured - using mock client');
    }
    
    // Retornar un cliente mock que no falla
    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdminInstance;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabaseAdmin();
    return client[prop as keyof SupabaseClient];
  },
});
