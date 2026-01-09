import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

/**
 * Cliente de Supabase con Service Role (solo servidor)
 * NUNCA exponer en el cliente
 */
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Tipos de la base de datos
export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'AWAITING_TRANSFER';

export type PaymentMethod = 'PAYPAL' | 'TRANSFER';

export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_usd: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  service_id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  patient_notes: string | null;
  start_at: string;
  end_at: string;
  status: AppointmentStatus;
  payment_method: PaymentMethod;
  paypal_order_id: string | null;
  paypal_capture_id: string | null;
  transfer_reference: string | null;
  transfer_receipt_url: string | null;
  approved_by: string | null;
  approved_at: string | null;
  calendar_event_id: string | null;
  created_at: string;
  updated_at: string;
}
