'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { validateEcuadorianId } from '../../lib/validation';

interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price_usd: number;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  isNew: boolean;
}

export default function ReservarPage() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patient, setPatient] = useState<Patient | null>(null);

  // Formulario de validación de cédula
  const [cedula, setCedula] = useState('');
  const [cedulaError, setCedulaError] = useState('');

  // Formulario de registro de paciente
  const [patientForm, setPatientForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: 'M' as 'M' | 'F' | 'OTRO',
    email: '',
    phone: '',
  });

  // Formulario de confirmación
  const [confirmedPatient, setConfirmedPatient] = useState(false);

  // Cargar servicios
  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error('Error loading services:', err));
  }, []);

  // Cargar slots cuando cambia la fecha o servicio
  useEffect(() => {
    if (selectedDate && selectedService) {
      setLoading(true);
      fetch(`/api/availability?date=${selectedDate}&serviceId=${selectedService.id}`)
        .then(res => res.json())
        .then(data => {
          setAvailableSlots(data.slots || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading slots:', err);
          setLoading(false);
        });
    }
  }, [selectedDate, selectedService]);

  // Validar cédula (solo validación ecuatoriana, sin consultar base de datos)
  const handleCedulaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCedulaError('');

    const cleanCedula = cedula.replace(/[\s-]/g, '');
    
    // Solo validar que la cédula sea válida según el algoritmo ecuatoriano
    if (!validateEcuadorianId(cleanCedula)) {
      setCedulaError('La cédula ingresada no es válida. Por favor verifica los datos.');
      return;
    }

    // Si la cédula es válida, pasar directamente al registro
    setStep(2);
  };

  // Registrar paciente
  const handlePatientRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanCedula = cedula.replace(/[\s-]/g, '');

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cedula: cleanCedula,
          firstName: patientForm.firstName,
          lastName: patientForm.lastName,
          birthDate: patientForm.birthDate,
          gender: patientForm.gender,
          email: patientForm.email,
          phone: patientForm.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar el paciente');
      }

      // Guardar datos del paciente localmente para usar después
      setPatient({
        id: data.patient.id,
        firstName: data.patient.firstName,
        lastName: data.patient.lastName,
        isNew: data.patient.isNew || true,
      });
      
      // Pasar directamente a confirmación
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Confirmar paciente
  const handlePatientConfirm = () => {
    if (confirmedPatient && patient) {
      setStep(4);
    }
  };

  // Seleccionar servicio
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(5);
  };

  // Seleccionar fecha
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot('');
    setStep(6);
  };

  // Seleccionar horario
  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setStep(7);
  };

  // Procesar pago
  const handlePayment = async (paymentMethod: 'PAYPAL' | 'TRANSFER') => {
    if (!selectedService || !selectedSlot || !patient) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          patientId: patient.id,
          startAt: selectedSlot,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear la cita');
      }

      const data = await response.json();
      
      if (paymentMethod === 'PAYPAL') {
        // Crear orden de PayPal
        const orderResponse = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appointmentId: data.appointment.id }),
        });

        const orderData = await orderResponse.json();
        
        // Redirigir a PayPal
        window.location.href = `https://www.${process.env.NEXT_PUBLIC_PAYPAL_MODE === 'live' ? '' : 'sandbox.'}paypal.com/checkoutnow?token=${orderData.orderId}`;
      } else {
        // Redirigir a página de instrucciones de transferencia
        window.location.href = `/payment/transfer?appointmentId=${data.appointment.id}`;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Generar fechas disponibles (próximos 30 días, lunes a sábado)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Incluir lunes a sábado (1-6)
      if (date.getDay() >= 1 && date.getDay() <= 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };

  // Generar horarios de prueba (lunes a sábado)
  const getMockTimeSlots = (date: string) => {
    const slots: string[] = [];
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay(); // 1 = Lunes, 6 = Sábado
    
    // Horarios según el día
    let startHour = 9;
    let endHour = 18;
    
    // Sábados: horario reducido 9:00 - 13:00
    if (dayOfWeek === 6) {
      endHour = 13;
    }
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotDate = new Date(dateObj);
        slotDate.setHours(hour, minute, 0, 0);
        slots.push(slotDate.toISOString());
      }
    }
    
    return slots;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Volver al inicio
        </Link>

        <h1 className="text-4xl font-bold mb-8">Reservar Cita</h1>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-12 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 7].map(num => (
            <div
              key={num}
              className={`flex-shrink-0 text-center min-w-[80px] ${
                step >= num ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  step >= num ? 'bg-primary-600 text-white' : 'bg-gray-300'
                }`}
              >
                {num}
              </div>
              <div className="text-xs">
                {num === 1 && 'Cédula'}
                {num === 2 && 'Registro'}
                {num === 3 && 'Confirmar'}
                {num === 4 && 'Especialidad'}
                {num === 5 && 'Fecha'}
                {num === 6 && 'Horario'}
                {num === 7 && 'Pago'}
              </div>
            </div>
          ))}
        </div>

        {/* Step 1: Validar Cédula */}
        {step === 1 && (
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">Validación de Identidad</h2>
            <p className="text-gray-600 mb-6">
              Para continuar con la reserva, necesitamos validar tu cédula ecuatoriana.
            </p>
            
            <form onSubmit={handleCedulaSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold">
                  Número de Cédula *
                </label>
                <input
                  type="text"
                  required
                  value={cedula}
                  onChange={e => {
                    setCedula(e.target.value);
                    setCedulaError('');
                  }}
                  placeholder="Ej: 1234567890"
                  maxLength={13}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                />
                {cedulaError && (
                  <p className="mt-2 text-red-600 text-sm">{cedulaError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!cedula.trim()}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Validar y Continuar
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Registrar Paciente */}
        {step === 2 && (
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">Registro de Paciente</h2>
            <p className="text-gray-600 mb-6">
              Por favor completa tus datos para continuar con la reserva.
            </p>
            
            <form onSubmit={handlePatientRegister}>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientForm.firstName}
                    onChange={e => setPatientForm({ ...patientForm, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Primer Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientForm.lastName}
                    onChange={e => setPatientForm({ ...patientForm, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    required
                    value={patientForm.birthDate}
                    onChange={e => setPatientForm({ ...patientForm, birthDate: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Género *
                  </label>
                  <select
                    required
                    value={patientForm.gender}
                    onChange={e => setPatientForm({ ...patientForm, gender: e.target.value as 'M' | 'F' | 'OTRO' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={patientForm.email}
                  onChange={e => setPatientForm({ ...patientForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold">
                  Celular *
                </label>
                <input
                  type="tel"
                  required
                  value={patientForm.phone}
                  onChange={e => setPatientForm({ ...patientForm, phone: e.target.value })}
                  placeholder="Ej: 0991234567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Registrando...' : 'Continuar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Confirmar Paciente */}
        {step === 3 && patient && (
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">Confirmar Identidad</h2>
            <p className="text-gray-600 mb-6">
              Por favor confirma que eres el paciente:
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="text-xl font-semibold mb-2">
                {patient.firstName} {patient.lastName}
              </p>
              <p className="text-gray-600">Cédula: {cedula.replace(/[\s-]/g, '')}</p>
            </div>

            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedPatient}
                  onChange={e => setConfirmedPatient(e.target.checked)}
                  className="mr-3 w-5 h-5"
                />
                <span className="text-gray-700">
                  Confirmo que soy {patient.firstName} {patient.lastName} y que la información es correcta
                </span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handlePatientConfirm}
                disabled={!confirmedPatient}
                className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar y Continuar
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Seleccionar Especialidad */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Selecciona la Especialidad de Ginecología</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {services.map(service => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition border-2 border-transparent hover:border-primary-500"
                >
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {service.duration_minutes} min
                    </span>
                    <span className="text-2xl font-bold text-primary-600">
                      ${service.price_usd}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Seleccionar Fecha */}
        {step === 5 && selectedService && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Selecciona una Fecha</h2>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <p className="mb-4">
                <strong>Servicio:</strong> {selectedService.name} - ${selectedService.price_usd}
              </p>
              <button
                onClick={() => setStep(4)}
                className="text-primary-600 hover:text-primary-700"
              >
                Cambiar servicio
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {getAvailableDates().map(date => {
                const dateObj = new Date(date);
                const dayName = dateObj.toLocaleDateString('es-EC', { weekday: 'short' });
                const dayNum = dateObj.getDate();
                const month = dateObj.toLocaleDateString('es-EC', { month: 'short' });

                return (
                  <button
                    key={date}
                    onClick={() => handleDateSelect(date)}
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedDate === date
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-400'
                    }`}
                  >
                    <div className="text-sm text-gray-600">{dayName}</div>
                    <div className="text-2xl font-bold">{dayNum}</div>
                    <div className="text-sm text-gray-600">{month}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: Seleccionar Horario */}
        {step === 6 && selectedDate && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Selecciona un Horario</h2>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <p className="mb-2">
                <strong>Servicio:</strong> {selectedService?.name}
              </p>
              <p className="mb-4">
                <strong>Fecha:</strong> {new Date(selectedDate).toLocaleDateString('es-EC', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <button
                onClick={() => setStep(5)}
                className="text-primary-600 hover:text-primary-700"
              >
                Cambiar fecha
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">Cargando horarios disponibles...</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {getMockTimeSlots(selectedDate).map(slot => {
                  const time = new Date(slot).toLocaleTimeString('es-EC', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <button
                      key={slot}
                      onClick={() => handleSlotSelect(slot)}
                      className={`p-4 rounded-lg border-2 transition ${
                        selectedSlot === slot
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-300 hover:border-primary-400'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 7: Resumen y Pago */}
        {step === 7 && selectedService && selectedSlot && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Resumen de tu Cita</h2>
            
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="font-semibold mb-4 text-lg">Detalles de la Cita Médica</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Paciente:</span>
                  <span className="font-semibold">{patient?.firstName} {patient?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Especialidad:</span>
                  <span className="font-semibold">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-semibold">
                    {new Date(selectedDate).toLocaleDateString('es-EC', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hora:</span>
                  <span className="font-semibold">
                    {new Date(selectedSlot).toLocaleTimeString('es-EC', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duración:</span>
                  <span className="font-semibold">{selectedService.duration_minutes} minutos</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-xl">
                    <span className="font-semibold">Valor de la Consulta:</span>
                    <span className="font-bold text-primary-600">${selectedService.price_usd}</span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Método de Pago</h3>
              <div className="space-y-4 mb-6">
                <button
                  onClick={() => handlePayment('PAYPAL')}
                  disabled={loading}
                  className="w-full p-4 border-2 border-primary-500 rounded-lg hover:bg-primary-50 transition text-left disabled:opacity-50"
                >
                  <div className="font-semibold">PayPal / Tarjeta de crédito</div>
                  <div className="text-sm text-gray-600">Pago seguro con PayPal</div>
                </button>

                <button
                  onClick={() => handlePayment('TRANSFER')}
                  disabled={loading}
                  className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left disabled:opacity-50"
                >
                  <div className="font-semibold">Transferencia bancaria</div>
                  <div className="text-sm text-gray-600">
                    Requiere aprobación manual (1-2 horas)
                  </div>
                </button>
              </div>

              <button
                onClick={() => setStep(6)}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Modificar Horario
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
