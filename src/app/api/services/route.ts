import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const { data: services, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      logger.error({ error }, 'Error fetching services');
      throw error;
    }

    return NextResponse.json(services || []);
  } catch (error) {
    logger.error({ error }, 'Error in services endpoint');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
