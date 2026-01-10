import { google } from 'googleapis';
import { logger } from './logger';

let calendar: any = null;

function getCalendar() {
  if (calendar) return calendar;

  if (!process.env.GOOGLE_CALENDAR_CREDENTIALS) {
    logger.warn('Google Calendar credentials not configured');
    return null;
  }

  try {
    const credentials = JSON.parse(process.env.GOOGLE_CALENDAR_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
      credentials,
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
    const event = {
      summary: `${serviceName} - ${patientName}`,
      description: `Cita ID: ${appointmentId}`,
      start: { dateTime: startAt },
      end: { dateTime: endAt },
      attendees: [{ email: patientEmail }],
    };

    const response = await cal.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all',
    });

    return response.data.id;
  } catch (error) {
    logger.error({ error, appointmentId }, 'Error creating calendar event');
    throw error;
  }
}
