import { supabaseAdmin, Appointment } from './supabaseAdmin';
import { logger } from './logger';
import { BUSINESS_CONFIG } from '../config/business';

/**
 * Generar slots disponibles para una fecha y servicio
 */
export async function getAvailableSlots(
  date: string,
  serviceId: string
): Promise<string[]> {
  try {
    // Verificar que no sea un día cerrado
    if (BUSINESS_CONFIG.closedDates.includes(date)) {
      return [];
    }

    // Verificar que sea un día laborable
    const dayOfWeek = new Date(date).getDay();
    if (!BUSINESS_CONFIG.workingDays.includes(dayOfWeek)) {
      return [];
    }

    // Obtener el servicio
    const { data: service, error: serviceError } = await supabaseAdmin
      .from('services')
      .select('duration_minutes')
      .eq('id', serviceId)
      .eq('is_active', true)
      .single();

    if (serviceError || !service) {
      logger.error({ serviceId, error: serviceError }, 'Service not found');
      return [];
    }

    // Generar todos los slots posibles
    const allSlots = generateDaySlots(date, service.duration_minutes);

    // Obtener citas existentes
    const { data: existingAppointments, error: appointmentsError } =
      await supabaseAdmin
        .from('appointments')
        .select('start_at, end_at')
        .gte('start_at', `${date}T00:00:00`)
        .lt('start_at', `${date}T23:59:59`)
        .in('status', ['PENDING', 'CONFIRMED', 'AWAITING_TRANSFER']);

    if (appointmentsError) {
      logger.error({ error: appointmentsError }, 'Error fetching appointments');
      throw appointmentsError;
    }

    // Filtrar slots ocupados
    const availableSlots = allSlots.filter((slot) => {
      const slotStart = new Date(slot);
      const slotEnd = new Date(slotStart.getTime() + service.duration_minutes * 60000);

      // Verificar si el slot está en el pasado
      const now = new Date();
      const minimumTime = new Date(
        now.getTime() + BUSINESS_CONFIG.minimumAdvanceBooking * 60 * 60000
      );
      if (slotStart < minimumTime) {
        return false;
      }

      // Verificar solapamiento con citas existentes
      const hasOverlap = existingAppointments?.some((apt) => {
        const aptStart = new Date(apt.start_at);
        const aptEnd = new Date(apt.end_at);
        return slotStart < aptEnd && slotEnd > aptStart;
      });

      return !hasOverlap;
    });

    return availableSlots;
  } catch (error) {
    logger.error({ error, date, serviceId }, 'Error getting available slots');
    throw error;
  }
}

/**
 * Generar slots para un día completo
 */
function generateDaySlots(date: string, durationMinutes: number): string[] {
  const slots: string[] = [];
  const { workingHours, slotDuration } = BUSINESS_CONFIG;

  for (let hour = workingHours.start; hour < workingHours.end; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const slotTime = `${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
      
      // Verificar que el slot + duración del servicio no exceda el horario
      const slotDate = new Date(slotTime);
      const endDate = new Date(slotDate.getTime() + durationMinutes * 60000);
      const endHour = endDate.getHours();
      
      if (endHour <= workingHours.end) {
        slots.push(slotTime);
      }
    }
  }

  return slots;
}

/**
 * Verificar si un slot está disponible
 */
export async function isSlotAvailable(
  startAt: string,
  durationMinutes: number
): Promise<boolean> {
  const endAt = new Date(new Date(startAt).getTime() + durationMinutes * 60000).toISOString();

  const { data, error } = await supabaseAdmin
    .from('appointments')
    .select('id')
    .in('status', ['PENDING', 'CONFIRMED', 'AWAITING_TRANSFER'])
    .or(`and(start_at.lt.${endAt},end_at.gt.${startAt})`);

  if (error) {
    logger.error({ error }, 'Error checking slot availability');
    throw error;
  }

  return !data || data.length === 0;
}
