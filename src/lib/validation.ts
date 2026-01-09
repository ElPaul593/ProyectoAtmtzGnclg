import { z } from 'zod';

/**
 * Esquemas de validación con Zod
 */

export const createAppointmentSchema = z.object({
  serviceId: z.string().uuid(),
  patientName: z.string().min(2).max(255),
  patientEmail: z.string().email(),
  patientPhone: z.string().min(7).max(50),
  patientNotes: z.string().max(1000).optional(),
  startAt: z.string().datetime(),
  paymentMethod: z.enum(['PAYPAL', 'TRANSFER']),
  transferReference: z.string().optional(),
});

export const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceId: z.string().uuid(),
});

export const adminDayQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const approveTransferSchema = z.object({
  appointmentId: z.string().uuid(),
  approvedBy: z.string().min(1),
});

export const agentRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
  context: z.record(z.any()).optional(),
});
