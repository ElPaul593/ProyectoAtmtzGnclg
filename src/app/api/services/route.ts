import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const { data: services, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      logger.error({ error }, 'Error fetching services');
      
      // Si la tabla no existe
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json(
          { error: 'La tabla de servicios no existe. Por favor ejecuta el script SQL de migración.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: `Error al cargar servicios: ${error.message || 'Error desconocido'}` },
        { status: 500 }
      );
    }

    return NextResponse.json(services || []);
  } catch (error: any) {
    logger.error({ error }, 'Error in services endpoint');
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
