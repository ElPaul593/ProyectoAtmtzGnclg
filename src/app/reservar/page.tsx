'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price_usd: number;
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

  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    patientNotes: '',
    paymentMethod: 'PAYPAL' as 'PAYPAL' | 'TRANSFER',
  });

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

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot('');
    setStep(3);
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setStep(4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService?.id,
          patientName: formData.patientName,
          patientEmail: formData.patientEmail,
          patientPhone: formData.patientPhone,
          patientNotes: formData.patientNotes,
          startAt: selectedSlot,
          paymentMethod: formData.paymentMethod,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear la cita');
      }

      const data = await response.json();
      
      if (formData.paymentMethod === 'PAYPAL') {
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

  // Generar fechas disponibles (próximos 30 días)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Excluir fines de semana
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Volver al inicio
        </Link>

        <h1 className="text-4xl font-bold mb-8">Reservar Cita</h1>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3, 4].map(num => (
            <div
              key={num}
              className={`flex-1 text-center ${
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
              <div className="text-sm">
                {num === 1 && 'Servicio'}
                {num === 2 && 'Fecha'}
                {num === 3 && 'Horario'}
                {num === 4 && 'Datos'}
              </div>
            </div>
          ))}
        </div>

        {/* Step 1: Seleccionar Servicio */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Selecciona un servicio</h2>
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

        {/* Step 2: Seleccionar Fecha */}
        {step === 2 && selectedService && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Selecciona una fecha</h2>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <p className="mb-4">
                <strong>Servicio:</strong> {selectedService.name} - ${selectedService.price_usd}
              </p>
              <button
                onClick={() => setStep(1)}
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

        {/* Step 3: Seleccionar Horario */}
        {step === 3 && selectedDate && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Selecciona un horario</h2>
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
                onClick={() => setStep(2)}
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
            ) : availableSlots.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <p className="text-yellow-800">
                  No hay horarios disponibles para esta fecha. Por favor selecciona otra fecha.
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Cambiar fecha
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {availableSlots.map(slot => {
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

        {/* Step 4: Formulario de Datos */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Completa tus datos</h2>
            
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="font-semibold mb-4">Resumen de tu cita:</h3>
              <p className="mb-2">
                <strong>Servicio:</strong> {selectedService?.name}
              </p>
              <p className="mb-2">
                <strong>Fecha:</strong> {new Date(selectedDate).toLocaleDateString('es-EC')}
              </p>
              <p className="mb-2">
                <strong>Hora:</strong> {new Date(selectedSlot).toLocaleTimeString('es-EC', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="mb-4">
                <strong>Precio:</strong> ${selectedService?.price_usd}
              </p>
              <button
                onClick={() => setStep(3)}
                className="text-primary-600 hover:text-primary-700"
              >
                Modificar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nombre completo *</label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Correo electrónico *</label>
                <input
                  type="email"
                  required
                  value={formData.patientEmail}
                  onChange={e => setFormData({ ...formData, patientEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Teléfono *</label>
                <input
                  type="tel"
                  required
                  value={formData.patientPhone}
                  onChange={e => setFormData({ ...formData, patientPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Notas adicionales (opcional)</label>
                <textarea
                  value={formData.patientNotes}
                  onChange={e => setFormData({ ...formData, patientNotes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Método de pago *</label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PAYPAL"
                      checked={formData.paymentMethod === 'PAYPAL'}
                      onChange={e => setFormData({ ...formData, paymentMethod: 'PAYPAL' })}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">PayPal / Tarjeta de crédito</div>
                      <div className="text-sm text-gray-600">Pago seguro con PayPal</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="TRANSFER"
                      checked={formData.paymentMethod === 'TRANSFER'}
                      onChange={e => setFormData({ ...formData, paymentMethod: 'TRANSFER' })}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">Transferencia bancaria</div>
                      <div className="text-sm text-gray-600">
                        Requiere aprobación manual (1-2 horas)
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : 'Continuar al pago'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
