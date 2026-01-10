import { google } from 'googleapis';
import { logger } from './logger';

let calendar: any = null;

function getCalendar() {
  if (calendar) return calendar;

  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!serviceAccountEmail || !privateKey || !calendarId) {
    logger.warn('Google Calendar credentials not configured');
    return null;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    calendar = google.calendar({ version: 'v3', auth });
    return calendar;
  } catch (error) {
    logger.error({ error }, 'Failed to initialize Google Calendar');
    return null;
  }
}

export async function createCalendarEvent(
  appointmentId: string,
  patientName: string,
  patientEmail: string,
  startAt: string,
  endAt: string,
  serviceName: string
): Promise<string | null> {
  const cal = getCalendar();
  
  if (!cal) {
    logger.warn('Calendar not configured, skipping event creation');
    return null;
  }

  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    
    const event = {
      summary: `${serviceName} - ${patientName}`,
      description: `Cita ID: ${appointmentId}`,
      start: { dateTime: startAt, timeZone: 'America/Guayaquil' },
      end: { dateTime: endAt, timeZone: 'America/Guayaquil' },
      attendees: [{ email: patientEmail }],
    };

    const response = await cal.events.insert({
      calendarId,
      resource: event,
      sendUpdates: 'all',
    });

    logger.info({ appointmentId, eventId: response.data.id }, 'Calendar event created');
    return response.data.id;
  } catch (error) {
    logger.error({ error, appointmentId }, 'Error creating calendar event');
    throw error;
  }
}
