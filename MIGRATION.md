# Migración de Base de Datos

Este documento contiene las instrucciones para migrar la base de datos y agregar la tabla de pacientes.

## Pasos para Ejecutar la Migración

1. **Conecta a tu base de datos Supabase** (a través del dashboard o CLI)

2. **Ejecuta el siguiente script SQL** en el SQL Editor de Supabase:

```sql
-- Crear tipo de género si no existe
DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('M', 'F', 'OTRO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Crear tabla de pacientes si no existe
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cedula VARCHAR(10) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  gender gender_type NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_patients_cedula ON patients(cedula);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);

-- Agregar trigger para updated_at si no existe
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Actualizar tabla de appointments para usar patient_id
-- Primero, agregar la columna patient_id si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'appointments' 
        AND column_name = 'patient_id'
    ) THEN
        -- Agregar columna patient_id
        ALTER TABLE appointments ADD COLUMN patient_id UUID;
        
        -- Crear foreign key
        ALTER TABLE appointments 
        ADD CONSTRAINT appointments_patient_id_fkey 
        FOREIGN KEY (patient_id) REFERENCES patients(id);
        
        -- Crear índice
        CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
        
        -- NOTA: Si ya tienes datos en appointments, necesitarás migrarlos manualmente
        -- o mantener ambas columnas (patient_id y patient_name/email/phone) temporalmente
    END IF;
END $$;

-- Opcional: Si quieres eliminar las columnas antiguas después de migrar los datos
-- (Solo ejecuta esto después de haber migrado todos los datos existentes)
-- ALTER TABLE appointments DROP COLUMN IF EXISTS patient_name;
-- ALTER TABLE appointments DROP COLUMN IF EXISTS patient_email;
-- ALTER TABLE appointments DROP COLUMN IF EXISTS patient_phone;
```

## Verificación

Después de ejecutar la migración, verifica que:

1. La tabla `patients` existe y tiene la estructura correcta
2. La tabla `appointments` tiene la columna `patient_id`
3. Los índices se crearon correctamente
4. Los triggers funcionan correctamente

## Notas Importantes

- Si ya tienes datos en la tabla `appointments`, necesitarás migrarlos manualmente a la nueva estructura
- La columna `patient_id` es opcional inicialmente, pero se requiere para crear nuevas citas
- Puedes mantener las columnas antiguas (`patient_name`, `patient_email`, `patient_phone`) temporalmente para compatibilidad con datos existentes
