import { NextRequest, NextResponse } from 'next/server';
import { createAppointmentSchema } from '../../../lib/validation';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { isSlotAvailable } from '../../../lib/slots';
import { logger } from '../../../lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = createAppointmentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.errors },
        { status: 400 }
      );
    }

    const {
      serviceId,
      patientName,
      patientEmail,
      patientPhone,
      patientNotes,
      startAt,
      paymentMethod,
      transferReference,
    } = result.data;

    // Obtener servicio
    const { data: service, error: serviceError } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .eq('is_active', true)
      .single();

    if (serviceError || !service) {
      return NextResponse.json(
        { error: 'Service not found or inactive' },
        { status: 404 }
      );
    }

    // Calcular end_at
    const startDate = new Date(startAt);
    const endDate = new Date(startDate.getTime() + service.duration_minutes * 60000);
    const endAt = endDate.toISOString();

    // Verificar disponibilidad
    const available = await isSlotAvailable(startAt, service.duration_minutes);
    if (!available) {
      return NextResponse.json(
        { error: 'Slot not available' },
        { status: 409 }
      );
    }

    // Determinar estado inicial
    let status: 'PENDING' | 'AWAITING_TRANSFER';
    if (paymentMethod === 'PAYPAL') {
      status = 'PENDING';
    } else {
      status = 'AWAITING_TRANSFER';
      if (!transferReference) {
        return NextResponse.json(
          { error: 'Transfer reference required for bank transfer' },
          { status: 400 }
        );
      }
    }

    // Crear cita
    const { data: appointment, error: appointmentError } = await supabaseAdmin
      .from('appointments')
      .insert({
        service_id: serviceId,
        patient_name: patientName,
        patient_email: patientEmail,
        patient_phone: patientPhone,
        patient_notes: patientNotes || null,
        start_at: startAt,
        end_at: endAt,
        status,
        payment_method: paymentMethod,
        transfer_reference: transferReference || null,
      })
      .select()
      .single();

    if (appointmentError) {
      logger.error({ error: appointmentError }, 'Error creating appointment');
      
      // Verificar si es violación de restricción única
      if (appointmentError.code === '23505') {
        return NextResponse.json(
          { error: 'Slot was just booked by another user' },
          { status: 409 }
        );
      }
      
      throw appointmentError;
    }

    logger.info(
      { appointmentId: appointment.id, status },
      'Appointment created successfully'
    );

    return NextResponse.json({
      appointment: {
        id: appointment.id,
        status: appointment.status,
        startAt: appointment.start_at,
        endAt: appointment.end_at,
        paymentMethod: appointment.payment_method,
      },
    }, { status: 201 });

  } catch (error) {
    logger.error({ error }, 'Error in appointments endpoint');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
