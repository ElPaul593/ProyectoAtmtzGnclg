import { NextRequest, NextResponse } from 'next/server';
import { availabilityQuerySchema } from '@/lib/validation';
import { getAvailableSlots } from '@/lib/slots';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const result = availabilityQuerySchema.safeParse({
      date: searchParams.get('date'),
      serviceId: searchParams.get('serviceId'),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: result.error.errors },
        { status: 400 }
      );
    }

    const { date, serviceId } = result.data;
    const availableSlots = await getAvailableSlots(date, serviceId);

    return NextResponse.json({
      date,
      serviceId,
      slots: availableSlots,
      count: availableSlots.length,
    });
  } catch (error) {
    logger.error({ error }, 'Error in availability endpoint');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
