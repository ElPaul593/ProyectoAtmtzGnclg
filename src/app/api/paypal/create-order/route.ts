import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { createPayPalOrder } from '../../../../lib/paypal';
import { logger } from '../../../../lib/logger';

const createOrderSchema = z.object({
  appointmentId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = createOrderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.errors },
        { status: 400 }
      );
    }

    const { appointmentId } = result.data;

    // Verificar que la cita existe y está en estado PENDING
    const { data: appointment, error: appointmentError } = await supabaseAdmin
      .from('appointments')
      .select('*, services(*)')
      .eq('id', appointmentId)
      .eq('status', 'PENDING')
      .eq('payment_method', 'PAYPAL')
      .single();

    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: 'Appointment not found or not in valid state' },
        { status: 404 }
      );
    }

    // Verificar si ya tiene una orden de PayPal
    if (appointment.paypal_order_id) {
      return NextResponse.json({
        orderId: appointment.paypal_order_id,
      });
    }

    // Crear orden en PayPal
    const { orderId } = await createPayPalOrder(
      appointment.services.price_usd.toFixed(2),
      appointmentId
    );

    // Actualizar cita con el order_id
    const { error: updateError } = await supabaseAdmin
      .from('appointments')
      .update({ paypal_order_id: orderId })
      .eq('id', appointmentId);

    if (updateError) {
      logger.error({ error: updateError }, 'Error updating appointment with order ID');
      throw updateError;
    }

    return NextResponse.json({ orderId });

  } catch (error) {
    logger.error({ error }, 'Error in create-order endpoint');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
