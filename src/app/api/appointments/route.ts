import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
      patientId,
      patientNotes,
      startAt,
      paymentMethod,
      transferReference,
    } = result.data;

    // Verificar que el paciente existe
    const { data: patient, error: patientError } = await supabaseAdmin
      .from('patients')
      .select('id')
      .eq('id', patientId)
      .maybeSingle();

    if (patientError) {
      if (patientError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Patient not found' },
          { status: 404 }
        );
      }
      if (patientError.code === '42P01' || patientError.message?.includes('does not exist')) {
        return NextResponse.json(
          { error: 'La tabla de pacientes no existe. Por favor ejecuta el script SQL de migración.' },
          { status: 500 }
        );
      }
      logger.error({ error: patientError }, 'Error checking patient');
      return NextResponse.json(
        { error: 'Error al verificar paciente' },
        { status: 500 }
      );
    }

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

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
      // transferReference es opcional al crear, se puede agregar después
    }

    // Crear cita
    const { data: appointment, error: appointmentError } = await supabaseAdmin
      .from('appointments')
      .insert({
        service_id: serviceId,
        patient_id: patientId,
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
