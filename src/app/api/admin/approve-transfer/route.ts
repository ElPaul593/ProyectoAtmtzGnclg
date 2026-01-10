import { NextRequest, NextResponse } from 'next/server';
import { approveTransferSchema } from '../../../../lib/validation';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { createCalendarEvent } from '../../../../lib/calendar';
import { verifyAdminAuth } from '../../../../lib/security';
import { logger } from '../../../../lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación de administrador
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const result = approveTransferSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.errors },
        { status: 400 }
      );
    }

    const { appointmentId, approvedBy } = result.data;

    // Obtener la cita
    const { data: appointment, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select('*, services(*)')
      .eq('id', appointmentId)
      .eq('status', 'AWAITING_TRANSFER')
      .single();

    if (fetchError || !appointment) {
      return NextResponse.json(
        { error: 'Appointment not found or not awaiting approval' },
        { status: 404 }
      );
    }

    // Crear evento en Google Calendar
    let calendarEventId: string | null = null;
    
    try {
      calendarEventId = await createCalendarEvent(
        appointment.id,
        appointment.patient_name,
        appointment.patient_email,
        appointment.start_at,
        appointment.end_at,
        appointment.services.name
      );
    } catch (calendarError) {
      logger.error(
        { error: calendarError, appointmentId },
        'Failed to create calendar event'
      );
      return NextResponse.json(
        { error: 'Failed to create calendar event' },
        { status: 500 }
      );
    }

    // Actualizar cita a CONFIRMED
    const { error: updateError } = await supabaseAdmin
      .from('appointments')
      .update({
        status: 'CONFIRMED',
        calendar_event_id: calendarEventId,
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .eq('status', 'AWAITING_TRANSFER'); // Condición para idempotencia

    if (updateError) {
      logger.error({ error: updateError, appointmentId }, 'Error approving appointment');
      throw updateError;
    }

    logger.info(
      { appointmentId, approvedBy, calendarEventId },
      'Transfer approved and appointment confirmed'
    );

    return NextResponse.json({
      success: true,
      appointmentId,
      calendarEventId,
    });

  } catch (error) {
    logger.error({ error }, 'Error in approve-transfer endpoint');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
