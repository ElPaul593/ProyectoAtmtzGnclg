import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { agentRequestSchema } from '../../../lib/validation';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { getAvailableSlots } from '../../../lib/slots';
import { logger } from '../../../lib/logger';
import { serverEnvRequired } from '../../../lib/env';

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

async function generateAiResponse(payload: {
  message: string;
  conversationHistory: { role: 'user' | 'assistant'; content: string }[];
  baseQuestion: string;
  context: AgentContext;
}) {
  try {
    const apiKey = serverEnvRequired.openaiApiKey('AI agent response');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content:
              'Eres un asistente de una clínica de ginecología y obstetricia. Tu objetivo es ayudar a completar reservas de citas. ' +
              'No brindes diagnósticos médicos. Responde en español de forma clara y amable.',
          },
          ...payload.conversationHistory,
          {
            role: 'user',
            content: payload.message,
          },
          {
            role: 'assistant',
            content:
              `Contexto actual: ${JSON.stringify(payload.context)}. ` +
              `Siguiente paso sugerido: ${payload.baseQuestion}`,
          },
          {
            role: 'user',
            content:
              'Redacta la siguiente pregunta para continuar la reserva. ' +
              'Mantén el objetivo del siguiente paso sugerido.',
          },
        ],
      }),
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'OpenAI response not OK');
      return null;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    return content || null;
  } catch (error) {
    logger.warn({ error }, 'OpenAI integration failed, using fallback');
    return null;
  }
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
      const baseQuestion =
        'Entiendo tu preocupación. Este servicio es únicamente para reservar citas. ' +
        '¿Te gustaría agendar una consulta con nuestro médico especialista para que pueda evaluarte personalmente?';
      const aiQuestion = await generateAiResponse({
        message,
        conversationHistory,
        baseQuestion,
        context: userContext,
      });

      return NextResponse.json({
        warning: SAFETY_WARNING,
        next_question: aiQuestion ?? baseQuestion,
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

      const baseQuestion =
        '¿Qué tipo de servicio necesitas? Tenemos: ' +
        services?.map(s => `\n- ${s.name} ($${s.price_usd})`).join('');
      const aiQuestion = await generateAiResponse({
        message,
        conversationHistory,
        baseQuestion,
        context: userContext,
      });

      return NextResponse.json({
        next_question: aiQuestion ?? baseQuestion,
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

      const baseQuestion =
        '¿Qué día te gustaría agendar tu cita? Aquí hay algunas opciones disponibles:';
      const aiQuestion = await generateAiResponse({
        message,
        conversationHistory,
        baseQuestion,
        context: userContext,
      });

      return NextResponse.json({
        next_question: aiQuestion ?? baseQuestion,
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
        const baseQuestion =
          'Lo siento, no hay horarios disponibles para ese día. ¿Te gustaría elegir otra fecha?';
        const aiQuestion = await generateAiResponse({
          message,
          conversationHistory,
          baseQuestion,
          context: userContext,
        });

        return NextResponse.json({
          next_question: aiQuestion ?? baseQuestion,
          filled_fields: { ...userContext, selectedDate: undefined },
          suggested_slots: [],
          requiresInput: ['selectedDate'],
        });
      }

      const baseQuestion =
        'Perfecto, aquí están los horarios disponibles. ¿Cuál prefieres?';
      const aiQuestion = await generateAiResponse({
        message,
        conversationHistory,
        baseQuestion,
        context: userContext,
      });

      return NextResponse.json({
        next_question: aiQuestion ?? baseQuestion,
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

      const baseQuestion = `Para completar tu reserva, necesito tu ${missingFields.join(', ')}. Por favor proporciónalos.`;
      const aiQuestion = await generateAiResponse({
        message,
        conversationHistory,
        baseQuestion,
        context: userContext,
      });

      return NextResponse.json({
        next_question: aiQuestion ?? baseQuestion,
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

      const baseQuestion =
        '¡Excelente! He creado tu cita. Ahora necesitas completar el pago para confirmarla. ' +
        '¿Prefieres pagar con PayPal/tarjeta o transferencia bancaria?';
      const aiQuestion = await generateAiResponse({
        message,
        conversationHistory,
        baseQuestion,
        context: { ...userContext, appointmentId: appointment.id },
      });

      return NextResponse.json({
        next_question: aiQuestion ?? baseQuestion,
        filled_fields: { ...userContext, appointmentId: appointment.id },
        appointmentId: appointment.id,
        payment_status: 'PENDING',
        payment_options: ['PAYPAL', 'TRANSFER'],
        requiresInput: ['paymentMethod'],
      });
    }

    // Cita ya creada, esperar pago
    const baseQuestion = 'Tu cita está reservada. Por favor procede con el pago para confirmarla.';
    const aiQuestion = await generateAiResponse({
      message,
      conversationHistory,
      baseQuestion,
      context: userContext,
    });

    return NextResponse.json({
      next_question: aiQuestion ?? baseQuestion,
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
