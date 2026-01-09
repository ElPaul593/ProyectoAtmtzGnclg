import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { capturePayPalOrder } from '@/lib/paypal';
import { logger } from '@/lib/logger';

const captureOrderSchema = z.object({
  orderId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = captureOrderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.errors },
        { status: 400 }
      );
    }

    const { orderId } = result.data;

    // Capturar la orden en PayPal
    const { captureId, status } = await capturePayPalOrder(orderId);

    // Nota: La confirmación real se hará en el webhook
    // Este endpoint solo captura y devuelve el resultado

    return NextResponse.json({
      captureId,
      status,
      message: 'Payment captured. Appointment will be confirmed via webhook.',
    });

  } catch (error) {
    logger.error({ error }, 'Error in capture-order endpoint');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
