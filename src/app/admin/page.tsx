'use client';

import { useState, useEffect } from 'react';

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  serviceName: string;
  startAt: string;
  endAt: string;
  status: string;
  paymentMethod: string;
  transferReference: string | null;
}

interface DayStats {
  total: number;
  confirmed: number;
  pending: number;
  awaitingTransfer: number;
  cancelled: number;
}

export default function AdminPage() {
  const [apiKey, setApiKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<DayStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authenticate = () => {
    if (apiKey.trim()) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Por favor ingresa la API Key');
    }
  };

  const loadDayData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/day?date=${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          throw new Error('API Key inválida');
        }
        throw new Error('Error al cargar datos');
      }

      const data = await response.json();
      setAppointments(data.appointments);
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveTransfer = async (appointmentId: string) => {
    if (!confirm('¿Confirmar la aprobación de esta transferencia?')) return;

    try {
      const response = await fetch('/api/admin/approve-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          appointmentId,
          approvedBy: 'Admin',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al aprobar transferencia');
      }

      alert('Transferencia aprobada exitosamente');
      loadDayData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDayData();
    }
  }, [selectedDate, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Panel de Administración
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && authenticate()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ingresa tu API Key"
            />
          </div>

          <button
            onClick={authenticate}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Acceder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Selector de fecha */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const date = new Date(selectedDate);
                date.setDate(date.getDate() - 1);
                setSelectedDate(date.toISOString().split('T')[0]);
              }}
              className="p-2 hover:bg-gray-100 rounded"
            >
              ←
            </button>
            
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            
            <button
              onClick={() => {
                const date = new Date(selectedDate);
                date.setDate(date.getDate() + 1);
                setSelectedDate(date.toISOString().split('T')[0]);
              }}
              className="p-2 hover:bg-gray-100 rounded"
            >
              →
            </button>

            <button
              onClick={loadDayData}
              disabled={loading}
              className="ml-auto bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-green-50 rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
              <div className="text-sm text-gray-600">Confirmadas</div>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
            <div className="bg-orange-50 rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.awaitingTransfer}</div>
              <div className="text-sm text-gray-600">Por aprobar</div>
            </div>
            <div className="bg-red-50 rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <div className="text-sm text-gray-600">Canceladas</div>
            </div>
          </div>
        )}

        {/* Lista de citas */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No hay citas para esta fecha
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(apt.startAt).toLocaleTimeString('es-EC', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{apt.patientName}</div>
                        <div className="text-sm text-gray-500">{apt.patientEmail}</div>
                        <div className="text-sm text-gray-500">{apt.patientPhone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{apt.serviceName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            apt.status === 'CONFIRMED'
                              ? 'bg-green-100 text-green-800'
                              : apt.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : apt.status === 'AWAITING_TRANSFER'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{apt.paymentMethod}</div>
                        {apt.transferReference && (
                          <div className="text-xs text-gray-500">
                            Ref: {apt.transferReference}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {apt.status === 'AWAITING_TRANSFER' && (
                          <button
                            onClick={() => approveTransfer(apt.id)}
                            className="text-green-600 hover:text-green-800 font-medium text-sm"
                          >
                            Aprobar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
