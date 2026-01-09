/**
 * Configuración centralizada de reglas de negocio
 */

export const BUSINESS_CONFIG = {
  // Horario de atención
  workingHours: {
    start: 9, // 9:00 AM
    end: 18, // 6:00 PM
  },

  // Días laborables (0 = Domingo, 6 = Sábado)
  workingDays: [1, 2, 3, 4, 5], // Lunes a Viernes

  // Duración de slots en minutos
  slotDuration: 15,

  // Tiempo mínimo de anticipación para reservar (en horas)
  minimumAdvanceBooking: 2,

  // Tiempo máximo de anticipación para reservar (en días)
  maximumAdvanceBooking: 90,

  // Días de cierre (formato: YYYY-MM-DD)
  closedDates: [
    '2024-12-25', // Navidad
    '2024-01-01', // Año Nuevo
    // Agregar más fechas según sea necesario
  ],

  // Tiempo de expiración para citas pendientes (en minutos)
  pendingExpirationMinutes: 30,

  // Zona horaria
  timezone: 'America/Guayaquil',
} as const;
