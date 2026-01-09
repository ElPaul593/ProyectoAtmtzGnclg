import { NextRequest, NextResponse } from 'next/server';
import { adminDayQuerySchema } from '@/lib/validation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyAdminAuth } from '@/lib/security';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación de administrador
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    const result = adminDayQuerySchema.safeParse({
      date: searchParams.get('date'),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: result.error.errors },
        { status: 400 }
      );
    }

    const { date } = result.data;

    // Obtener citas del día
    const { data: appointments, error } = await supabaseAdmin
      .from('appointments')
      .select('*, services(name)')
      .gte('start_at', `${date}T00:00:00`)
      .lt('start_at', `${date}T23:59:59`)
      .order('start_at', { ascending: true });

    if (error) {
      logger.error({ error, date }, 'Error fetching appointments');
      throw error;
    }

    // Calcular estadísticas
    const stats = {
      total: appointments?.length || 0,
      confirmed: appointments?.filter(a => a.status === 'CONFIRMED').length || 0,
      pending: appointments?.filter(a => a.status === 'PENDING').length || 0,
      awaitingTransfer: appointments?.filter(a => a.status === 'AWAITING_TRANSFER').length || 0,
      cancelled: appointments?.filter(a => a.status === 'CANCELLED').length || 0,
    };

    return NextResponse.json({
      date,
      stats,
      appointments: appointments?.map(apt => ({
        id: apt.id,
        patientName: apt.patient_name,
        patientEmail: apt.patient_email,
        patientPhone: apt.patient_phone,
        serviceName: apt.services?.name,
        startAt: apt.start_at,
        endAt: apt.end_at,
        status: apt.status,
        paymentMethod: apt.payment_method,
        transferReference: apt.transfer_reference,
        createdAt: apt.created_at,
      })) || [],
    });

  } catch (error) {
    logger.error({ error }, 'Error in admin day endpoint');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
