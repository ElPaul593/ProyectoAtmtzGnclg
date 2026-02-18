import { z } from 'zod';

/**
 * Esquemas de validación con Zod
 */

/**
 * Validador de cédulas ecuatorianas
 * Formato: 10 dígitos, el último es el dígito verificador
 */
export function validateEcuadorianId(cedula: string): boolean {
  // Remover espacios y guiones
  const cleanCedula = cedula.replace(/[\s-]/g, '');
  
  // Debe tener exactamente 10 dígitos
  if (!/^\d{10}$/.test(cleanCedula)) {
    return false;
  }

  // Algoritmo de validación de cédula ecuatoriana
  const digits = cleanCedula.split('').map(Number);
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let product = digits[i] * coefficients[i];
    if (product >= 10) {
      product = product - 9;
    }
    sum += product;
  }
  
  const checkDigit = sum % 10 === 0 ? 0 : 10 - (sum % 10);
  
  return checkDigit === digits[9];
}

export const ecuadorianIdSchema = z.string()
  .refine((val) => {
    const clean = val.replace(/[\s-]/g, '');
    return /^\d{10}$/.test(clean);
  }, { message: 'La cédula debe tener 10 dígitos' })
  .refine((val) => validateEcuadorianId(val), {
    message: 'La cédula no es válida',
  });

export const registerPatientSchema = z.object({
  cedula: ecuadorianIdSchema,
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  gender: z.enum(['M', 'F', 'OTRO']),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
});

export const createAppointmentSchema = z.object({
  serviceId: z.string().uuid(),
  patientId: z.string().uuid(),
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
