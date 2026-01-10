import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { verifyWebhookSignature } from '../../../../lib/paypal';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { createCalendarEvent } from '../../../../lib/calendar';
import { logger } from '../../../../lib/logger';
import { generateIdempotencyKey } from '../../../../lib/security';

export async function POST(request: NextRequest) {
  try {
    // Leer el body como texto para verificación
    const body = await request.text();
    const event = JSON.parse(body);

    // Obtener headers para verificación
    const headers = {
      'paypal-transmission-id': request.headers.get('paypal-transmission-id') || '',
      'paypal-transmission-time': request.headers.get('paypal-transmission-time') || '',
      'paypal-cert-url': request.headers.get('paypal-cert-url') || '',
      'paypal-auth-algo': request.headers.get('paypal-auth-algo') || '',
      'paypal-transmission-sig': request.headers.get('paypal-transmission-sig') || '',
    };

    // Verificar firma del webhook
    const isValid = await verifyWebhookSignature(headers, body);
    if (!isValid) {
      logger.error({ event }, 'Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    logger.info({ eventType: event.event_type }, 'Valid webhook received');

    // Procesar solo eventos de pago completado
    if (event.event_type === 'CHECKOUT.ORDER.APPROVED' || 
        event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      
      const orderId = event.resource.id || event.resource.supplementary_data?.related_ids?.order_id;
      
      if (!orderId) {
        logger.warn({ event }, 'No order ID in webhook event');
        return NextResponse.json({ received: true });
      }

      // Clave de idempotencia para evitar procesamiento duplicado
      const idempotencyKey = generateIdempotencyKey(`webhook-${orderId}`);

      // Buscar la cita
      const { data: appointment, error: fetchError } = await supabaseAdmin
        .from('appointments')
        .select('*, services(*)')
        .eq('paypal_order_id', orderId)
        .single();

      if (fetchError || !appointment) {
        logger.warn({ orderId }, 'Appointment not found for order');
        return NextResponse.json({ received: true });
      }

      // Verificar si ya está confirmada (idempotencia)
      if (appointment.status === 'CONFIRMED' && appointment.calendar_event_id) {
        logger.info({ appointmentId: appointment.id }, 'Appointment already confirmed');
        return NextResponse.json({ received: true });
      }

      // Extraer capture ID si está disponible
      let captureId = appointment.paypal_capture_id;
      if (event.resource.purchase_units?.[0]?.payments?.captures?.[0]?.id) {
        captureId = event.resource.purchase_units[0].payments.captures[0].id;
      }

      // Crear evento en Google Calendar
      let calendarEventId = appointment.calendar_event_id;
      
      if (!calendarEventId) {
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
            { error: calendarError, appointmentId: appointment.id },
            'Failed to create calendar event'
          );
          // No fallar el webhook por error de calendario
        }
      }

      // Actualizar cita a CONFIRMED
      const { error: updateError } = await supabaseAdmin
        .from('appointments')
        .update({
          status: 'CONFIRMED',
          paypal_capture_id: captureId,
          calendar_event_id: calendarEventId,
        })
        .eq('id', appointment.id)
        .eq('status', 'PENDING'); // Condición para idempotencia

      if (updateError) {
        logger.error(
          { error: updateError, appointmentId: appointment.id },
          'Error confirming appointment'
        );
        throw updateError;
      }

      logger.info(
        {
          appointmentId: appointment.id,
          orderId,
          captureId,
          calendarEventId,
        },
        'Appointment confirmed via webhook'
      );
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    logger.error({ error }, 'Error processing webhook');
    // Devolver 200 para evitar reintentos innecesarios
    return NextResponse.json({ received: true });
  }
}
