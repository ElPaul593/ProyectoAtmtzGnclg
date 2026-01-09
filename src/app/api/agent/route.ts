import { NextRequest, NextResponse } from 'next/server';
import { agentRequestSchema } from '@/lib/validation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAvailableSlots } from '@/lib/slots';
import { logger } from '@/lib/logger';

const SAFETY_WARNING = `
⚠️ ADVERTENCIA IMPORTANTE:
Este agente solo asiste con la reserva de citas. NO proporciona diagnósticos médicos, 
recetas ni consejos médicos.

🚨 EN CASO DE EMERGENCIA:
- Dolor severo o sangrado abundante
- Presión arterial muy alta
- Pérdida de conocimiento
- Trabajo de parto prematuro

LLAME AL 911 o acuda al servicio de emergencias más cercano INMEDIATAMENTE.
`;

interface AgentContext {
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  serviceId?: string;
  selectedDate?: string;
  selectedSlot?: string;
  appointmentId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = agentRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.errors },
        { status: 400 }
      );
    }

    const { message, conversationHistory = [], context = {} } = result.data;
    const userContext = context as AgentContext;

    // Detectar si el usuario solicita consejo médico
    const medicalKeywords = [
      'dolor', 'sangrado', 'embarazada', 'síntoma', 'diagnostico',
      'receta', 'medicamento', 'tratamiento', 'enfermedad'
    ];
    
    const askingMedicalAdvice = medicalKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (askingMedicalAdvice) {
      return NextResponse.json({
        warning: SAFETY_WARNING,
        next_question: 'Entiendo tu preocupación. Este servicio es únicamente para reservar citas. ¿Te gustaría agendar una consulta con nuestro médico especialista para que pueda evaluarte personalmente?',
        filled_fields: userContext,
        suggested_slots: [],
        requiresInput: ['confirmation'],
      });
    }

    // Obtener servicios disponibles si no se ha seleccionado uno
    if (!userContext.serviceId) {
      const { data: services } = await supabaseAdmin
        .from('services')
        .select('*')
        .eq('is_active', true);

      return NextResponse.json({
        next_question: '¿Qué tipo de servicio necesitas? Tenemos: ' + 
          services?.map(s => `\n- ${s.name} ($${s.price_usd})`).join(''),
        filled_fields: userContext,
        suggested_slots: [],
        available_services: services,
        requiresInput: ['serviceId'],
      });
    }

    // Si tiene servicio pero no fecha, sugerir fechas
    if (!userContext.selectedDate) {
      const today = new Date();
      const suggestedDates = [];
      
      for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        suggestedDates.push(date.toISOString().split('T')[0]);
      }

      return NextResponse.json({
        next_question: '¿Qué día te gustaría agendar tu cita? Aquí hay algunas opciones disponibles:',
        filled_fields: userContext,
        suggested_dates: suggestedDates,
        requiresInput: ['selectedDate'],
      });
    }

    // Si tiene fecha pero no slot, mostrar slots disponibles
    if (!userContext.selectedSlot) {
      const slots = await getAvailableSlots(
        userContext.selectedDate,
        userContext.serviceId
      );

      if (slots.length === 0) {
        return NextResponse.json({
          next_question: 'Lo siento, no hay horarios disponibles para ese día. ¿Te gustaría elegir otra fecha?',
          filled_fields: { ...userContext, selectedDate: undefined },
          suggested_slots: [],
          requiresInput: ['selectedDate'],
        });
      }

      return NextResponse.json({
        next_question: 'Perfecto, aquí están los horarios disponibles. ¿Cuál prefieres?',
        filled_fields: userContext,
        suggested_slots: slots.map(slot => {
          const date = new Date(slot);
          return {
            value: slot,
            display: date.toLocaleTimeString('es-EC', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
          };
        }),
        requiresInput: ['selectedSlot'],
      });
    }

    // Si falta información del paciente
    if (!userContext.patientName || !userContext.patientEmail || !userContext.patientPhone) {
      const missingFields = [];
      if (!userContext.patientName) missingFields.push('nombre completo');
      if (!userContext.patientEmail) missingFields.push('correo electrónico');
      if (!userContext.patientPhone) missingFields.push('teléfono');

      return NextResponse.json({
        next_question: `Para completar tu reserva, necesito tu ${missingFields.join(', ')}. Por favor proporciónalos.`,
        filled_fields: userContext,
        requiresInput: missingFields,
      });
    }

    // Todo está completo, crear la cita
    if (!userContext.appointmentId) {
      const { data: service } = await supabaseAdmin
        .from('services')
        .select('duration_minutes')
        .eq('id', userContext.serviceId)
        .single();

      if (!service) {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        );
      }

      const startDate = new Date(userContext.selectedSlot);
      const endDate = new Date(startDate.getTime() + service.duration_minutes * 60000);

      const { data: appointment, error } = await supabaseAdmin
        .from('appointments')
        .insert({
          service_id: userContext.serviceId,
          patient_name: userContext.patientName,
          patient_email: userContext.patientEmail,
          patient_phone: userContext.patientPhone,
          start_at: userContext.selectedSlot,
          end_at: endDate.toISOString(),
          status: 'PENDING',
          payment_method: 'PAYPAL',
        })
        .select()
        .single();

      if (error) {
        logger.error({ error }, 'Error creating appointment via agent');
        return NextResponse.json(
          { error: 'Failed to create appointment' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        next_question: '¡Excelente! He creado tu cita. Ahora necesitas completar el pago para confirmarla. ¿Prefieres pagar con PayPal/tarjeta o transferencia bancaria?',
        filled_fields: { ...userContext, appointmentId: appointment.id },
        appointmentId: appointment.id,
        payment_status: 'PENDING',
        payment_options: ['PAYPAL', 'TRANSFER'],
        requiresInput: ['paymentMethod'],
      });
    }

    // Cita ya creada, esperar pago
    return NextResponse.json({
      next_question: 'Tu cita está reservada. Por favor procede con el pago para confirmarla.',
      filled_fields: userContext,
      appointmentId: userContext.appointmentId,
      payment_status: 'AWAITING_PAYMENT',
    });

  } catch (error) {
    logger.error({ error }, 'Error in agent endpoint');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
