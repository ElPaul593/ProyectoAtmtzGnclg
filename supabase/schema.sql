-- Enumeraciones
CREATE TYPE appointment_status AS ENUM (
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'EXPIRED',
  'AWAITING_TRANSFER'
);

CREATE TYPE payment_method AS ENUM (
  'PAYPAL',
  'TRANSFER'
);

-- Tabla de servicios
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price_usd DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de citas
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id),
  
  -- Datos del paciente
  patient_name VARCHAR(255) NOT NULL,
  patient_email VARCHAR(255) NOT NULL,
  patient_phone VARCHAR(50) NOT NULL,
  patient_notes TEXT,
  
  -- Fecha y hora
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Estado y pago
  status appointment_status NOT NULL DEFAULT 'PENDING',
  payment_method payment_method NOT NULL,
  
  -- PayPal
  paypal_order_id VARCHAR(255),
  paypal_capture_id VARCHAR(255),
  
  -- Transferencia bancaria
  transfer_reference VARCHAR(255),
  transfer_receipt_url TEXT,
  approved_by VARCHAR(255),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Google Calendar
  calendar_event_id VARCHAR(255),
  
  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices y restricciones
  CONSTRAINT valid_time_range CHECK (end_at > start_at)
);

-- Índice único para prevenir doble reserva
CREATE UNIQUE INDEX idx_no_double_booking 
ON appointments (start_at) 
WHERE status IN ('PENDING', 'CONFIRMED', 'AWAITING_TRANSFER');

-- Índices para consultas comunes
CREATE INDEX idx_appointments_date ON appointments (start_at);
CREATE INDEX idx_appointments_status ON appointments (status);
CREATE INDEX idx_appointments_paypal_order ON appointments (paypal_order_id);

-- Tabla de métricas diarias (opcional)
CREATE TABLE daily_metrics (
  date DATE PRIMARY KEY,
  total_appointments INTEGER DEFAULT 0,
  confirmed_appointments INTEGER DEFAULT 0,
  pending_appointments INTEGER DEFAULT 0,
  revenue_usd DECIMAL(10, 2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Datos iniciales de servicios
INSERT INTO services (name, description, duration_minutes, price_usd) VALUES
  ('Consulta General', 'Consulta ginecológica completa', 30, 50.00),
  ('Control Prenatal', 'Seguimiento del embarazo', 45, 75.00),
  ('Ecografía', 'Ecografía ginecológica u obstétrica', 30, 60.00),
  ('Papanicolaou', 'Examen de detección de cáncer cervical', 20, 40.00);
