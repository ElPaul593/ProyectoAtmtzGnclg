'use client';

import { useSearchParams } from 'next/navigation';

export default function TransferClient() {
  const searchParams = useSearchParams();

  const appointmentId = searchParams.get('appointmentId') ?? '';
  const reservationId = searchParams.get('reservationId') ?? '';

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Pago por transferencia</h1>

      <div className="mt-4 rounded-lg border p-4">
        <p className="text-sm text-gray-600">
          Esta página lee parámetros desde la URL (query string). Si no existen, se mostrará vacío.
        </p>

        <div className="mt-4 space-y-2 text-sm">
          <div>
            <span className="font-medium">appointmentId:</span> {appointmentId || '—'}
          </div>
          <div>
            <span className="font-medium">reservationId:</span> {reservationId || '—'}
          </div>
        </div>

        <div className="mt-6 rounded-md bg-gray-50 p-4 text-sm">
          <p className="font-medium">Instrucciones (ejemplo)</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Realiza la transferencia a la cuenta indicada por la clínica.</li>
            <li>Sube el comprobante (si tu flujo lo requiere).</li>
            <li>Tu cita quedará confirmada cuando el sistema verifique el pago.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
