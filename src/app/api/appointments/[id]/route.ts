import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { logger } from '../../../../lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const appointmentId = resolvedParams.id;

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    // Obtener cita con información del paciente y servicio
    const { data: appointment, error: appointmentError } = await supabaseAdmin
      .from('appointments')
      .select(`
        *,
        patients (
          id,
          first_name,
          last_name,
          email,
          phone,
          cedula
        ),
        services (
          id,
          name,
          description,
          duration_minutes,
          price_usd
        )
      `)
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      appointment: {
        id: appointment.id,
        status: appointment.status,
        startAt: appointment.start_at,
        endAt: appointment.end_at,
        paymentMethod: appointment.payment_method,
        transferReference: appointment.transfer_reference,
        patientNotes: appointment.patient_notes,
        patient: appointment.patients,
        service: appointment.services,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching appointment');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
