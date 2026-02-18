'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AppointmentDetails {
  id: string;
  status: string;
  startAt: string;
  endAt: string;
  paymentMethod: string;
  transferReference: string | null;
  patientNotes: string | null;
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    cedula: string;
  };
  service: {
    id: string;
    name: string;
    description: string;
    duration_minutes: number;
    price_usd: number;
  };
}

export default function TransferClient() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId') ?? '';
  
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transferReference, setTransferReference] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    } else {
      setError('No se proporcionó un ID de cita');
      setLoading(false);
    }
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar los detalles de la cita');
      }

      setAppointment(data.appointment);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferReference.trim()) {
      setError('Por favor ingresa el número de referencia de la transferencia');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Aquí podrías actualizar la cita con la referencia de transferencia
      // Por ahora solo mostramos un mensaje
      alert('Referencia de transferencia registrada. Tu cita será confirmada una vez verifiquemos el pago.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Cargando información de la cita...</p>
        </div>
      </main>
    );
  }

  if (error && !appointment) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-red-800 mb-2">Error</h1>
          <p className="text-red-600">{error}</p>
          <Link href="/reservar" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
            ← Volver a reservar
          </Link>
        </div>
      </main>
    );
  }

  if (!appointment) {
    return null;
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
        ← Volver al inicio
      </Link>

      <h1 className="text-3xl font-bold mb-6">Pago por Transferencia Bancaria</h1>

      {/* Resumen de la Cita */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Resumen de tu Cita</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Paciente:</span>
            <span className="font-semibold">
              {appointment.patient.first_name} {appointment.patient.last_name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Especialidad:</span>
            <span className="font-semibold">{appointment.service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fecha:</span>
            <span className="font-semibold">
              {new Date(appointment.startAt).toLocaleDateString('es-EC', {
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
              {new Date(appointment.startAt).toLocaleTimeString('es-EC', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duración:</span>
            <span className="font-semibold">{appointment.service.duration_minutes} minutos</span>
          </div>
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between text-xl">
              <span className="font-semibold">Total a Pagar:</span>
              <span className="font-bold text-primary-600">${appointment.service.price_usd}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instrucciones de Pago */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Instrucciones de Pago</h2>
        <div className="space-y-4 text-blue-800">
          <div>
            <h3 className="font-semibold mb-2">Datos Bancarios:</h3>
            <div className="bg-white p-4 rounded border border-blue-200">
              <p className="mb-2"><strong>Banco:</strong> [Nombre del Banco]</p>
              <p className="mb-2"><strong>Tipo de Cuenta:</strong> Corriente</p>
              <p className="mb-2"><strong>Número de Cuenta:</strong> [Número de cuenta]</p>
              <p className="mb-2"><strong>Titular:</strong> [Nombre del titular]</p>
              <p className="mb-2"><strong>RUC/CI:</strong> [RUC o CI]</p>
              <p><strong>Email:</strong> [Email para confirmación]</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Pasos a Seguir:</h3>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Realiza la transferencia bancaria por el monto exacto de <strong>${appointment.service.price_usd}</strong></li>
              <li>Guarda el número de referencia o comprobante de la transferencia</li>
              <li>Ingresa el número de referencia en el formulario a continuación</li>
              <li>Tu cita quedará en estado "Pendiente de Aprobación"</li>
              <li>Nuestro equipo verificará el pago en un plazo de 1-2 horas</li>
              <li>Recibirás un correo de confirmación una vez aprobado el pago</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 rounded p-4 mt-4">
            <p className="text-yellow-800 text-sm">
              <strong>Importante:</strong> Tu cita quedará reservada temporalmente. 
              Si el pago no se verifica en 24 horas, la cita será cancelada automáticamente.
            </p>
          </div>
        </div>
      </div>

      {/* Formulario de Referencia */}
      {appointment.status === 'AWAITING_TRANSFER' && !appointment.transferReference && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Registrar Referencia de Transferencia</h2>
          <form onSubmit={handleSubmitReference}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">
                Número de Referencia de la Transferencia *
              </label>
              <input
                type="text"
                required
                value={transferReference}
                onChange={e => setTransferReference(e.target.value)}
                placeholder="Ingresa el número de referencia del comprobante"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-600">
                Este número aparece en tu comprobante de transferencia bancaria
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Enviando...' : 'Registrar Referencia'}
            </button>
          </form>
        </div>
      )}

      {/* Estado de la Cita */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Estado de tu Cita</h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Estado:</span>
            <span className={`font-semibold ${
              appointment.status === 'CONFIRMED' ? 'text-green-600' :
              appointment.status === 'AWAITING_TRANSFER' ? 'text-yellow-600' :
              'text-gray-600'
            }`}>
              {appointment.status === 'CONFIRMED' && '✓ Confirmada'}
              {appointment.status === 'AWAITING_TRANSFER' && '⏳ Pendiente de Aprobación'}
              {appointment.status === 'PENDING' && '⏳ Pendiente'}
            </span>
          </div>
          {appointment.transferReference && (
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Referencia:</span>
              <span className="font-mono font-semibold">{appointment.transferReference}</span>
            </div>
          )}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              ID de Cita: <span className="font-mono">{appointment.id}</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
