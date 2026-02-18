import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { registerPatientSchema, ecuadorianIdSchema } from '../../../lib/validation';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { logger } from '../../../lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cedula = searchParams.get('cedula');

    if (!cedula) {
      return NextResponse.json(
        { error: 'Cédula is required' },
        { status: 400 }
      );
    }

    // Validar formato de cédula
    const cleanCedula = cedula.replace(/[\s-]/g, '');
    const validation = ecuadorianIdSchema.safeParse(cleanCedula);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Cédula inválida', details: validation.error.errors },
        { status: 400 }
      );
    }

    // Buscar paciente
    const { data: patient, error: patientError } = await supabaseAdmin
      .from('patients')
      .select('id, first_name, last_name, email, phone')
      .eq('cedula', cleanCedula)
      .maybeSingle();

    // Si hay un error de conexión o tabla no existe
    if (patientError) {
      // Error PGRST116 significa "no encontrado" - esto es normal
      if (patientError.code === 'PGRST116') {
        return NextResponse.json({
          exists: false,
        });
      }
      // Otros errores (tabla no existe, etc.)
      logger.error({ error: patientError }, 'Error checking patient');
      return NextResponse.json(
        { error: 'Error al verificar paciente. Verifica que la tabla de pacientes exista en la base de datos.' },
        { status: 500 }
      );
    }

    if (!patient) {
      return NextResponse.json({
        exists: false,
      });
    }

    return NextResponse.json({
      exists: true,
      patient: {
        id: patient.id,
        firstName: patient.first_name,
        lastName: patient.last_name,
        email: patient.email,
        phone: patient.phone,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Error checking patient');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = registerPatientSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.errors },
        { status: 400 }
      );
    }

    const {
      cedula,
      firstName,
      lastName,
      birthDate,
      gender,
      email,
      phone,
    } = result.data;

    // Verificar si el paciente ya existe
    const { data: existingPatient, error: checkError } = await supabaseAdmin
      .from('patients')
      .select('id, first_name, last_name')
      .eq('cedula', cedula)
      .maybeSingle();

    // Si hay error de conexión o tabla no existe
    if (checkError && checkError.code !== 'PGRST116') {
      logger.error({ error: checkError }, 'Error checking existing patient');
      return NextResponse.json(
        { error: 'Error al verificar paciente. Verifica que la tabla de pacientes exista en la base de datos.' },
        { status: 500 }
      );
    }

    if (existingPatient) {
      // Retornar el paciente existente
      return NextResponse.json({
        patient: {
          id: existingPatient.id,
          firstName: existingPatient.first_name,
          lastName: existingPatient.last_name,
          isNew: false,
        },
      });
    }

    // Crear nuevo paciente
    const { data: patient, error: patientError } = await supabaseAdmin
      .from('patients')
      .insert({
        cedula,
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        gender,
        email,
        phone,
      })
      .select()
      .single();

    if (patientError) {
      logger.error({ error: patientError }, 'Error creating patient');
      
      // Si es violación de restricción única (cedula o email duplicado)
      if (patientError.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe un paciente con esta cédula o correo electrónico' },
          { status: 409 }
        );
      }

      // Si la tabla no existe
      if (patientError.code === '42P01' || patientError.message?.includes('does not exist')) {
        return NextResponse.json(
          { error: 'La tabla de pacientes no existe. Por favor ejecuta el script SQL de migración.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: `Error al crear paciente: ${patientError.message || 'Error desconocido'}` },
        { status: 500 }
      );
    }

    logger.info(
      { patientId: patient.id, cedula },
      'Patient created successfully'
    );

    return NextResponse.json({
      patient: {
        id: patient.id,
        firstName: patient.first_name,
        lastName: patient.last_name,
        isNew: true,
      },
    }, { status: 201 });

  } catch (error) {
    logger.error({ error }, 'Error in patients endpoint');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
