import { google } from 'googleapis';
import { logger } from './logger';

/**
 * Obtener cliente autenticado de Google Calendar
 */
function getCalendarClient() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL');
  }
  
  if (!process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Missing GOOGLE_PRIVATE_KEY');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  return google.calendar({ version: 'v3', auth });
}

/**
 * Crear evento en Google Calendar
 */
export async function createCalendarEvent(
  appointmentId: string,
  patientName: string,
  patientEmail: string,
  startAt: string,
  endAt: string,
  serviceName: string
): Promise<string> {
  try {
    const calendar = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      throw new Error('Missing GOOGLE_CALENDAR_ID');
    }

    const event = {
      summary: `Cita: ${serviceName}`,
      description: `Paciente: ${patientName}\nID de cita: ${appointmentId}`,
      start: {
        dateTime: startAt,
        timeZone: 'America/Guayaquil',
      },
      end: {
        dateTime: endAt,
        timeZone: 'America/Guayaquil',
      },
      attendees: [
        {
          email: patientEmail,
          displayName: patientName,
        },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 día antes
          { method: 'popup', minutes: 60 }, // 1 hora antes
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
      sendUpdates: 'all',
    });

    const eventId = response.data.id;
    if (!eventId) {
      throw new Error('No event ID returned from Google Calendar');
    }

    logger.info(
      { appointmentId, eventId },
      'Calendar event created successfully'
    );

    return eventId;
  } catch (error) {
    logger.error({ error, appointmentId }, 'Error creating calendar event');
    throw error;
  }
}

/**
 * Cancelar evento en Google Calendar
 */
export async function cancelCalendarEvent(eventId: string): Promise<void> {
  try {
    const calendar = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      throw new Error('Missing GOOGLE_CALENDAR_ID');
    }

    await calendar.events.delete({
      calendarId,
      eventId,
      sendUpdates: 'all',
    });

    logger.info({ eventId }, 'Calendar event cancelled successfully');
  } catch (error) {
    logger.error({ error, eventId }, 'Error cancelling calendar event');
    throw error;
  }
}
