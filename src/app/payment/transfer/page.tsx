'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function TransferPage() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-yellow-100 rounded-full p-4 mb-4">
              <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Cita Reservada</h1>
            <p className="text-gray-600">
              Tu cita está reservada temporalmente. Para confirmarla, realiza la transferencia bancaria.
            </p>
          </div>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Datos bancarios:</h2>
            <div className="space-y-2">
              <p><strong>Banco:</strong> Banco Pichincha</p>
              <p><strong>Cuenta:</strong> 1234567890</p>
              <p><strong>Tipo:</strong> Ahorros</p>
              <p><strong>Beneficiario:</strong> Clínica Ginecológica S.A.</p>
              <p><strong>RUC:</strong> 1234567890001</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-2">⚠️ Importante:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>Usa como referencia el ID de cita: <code className="bg-white px-2 py-1 rounded">{appointmentId}</code></li>
              <li>Guarda el comprobante de transferencia</li>
              <li>Envíanos una foto del comprobante a través del formulario</li>
              <li>Tu cita será confirmada en 1-2 horas hábiles después de la verificación</li>
            </ul>
          </div>

          <form className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">
                Comprobante de pago (imagen o PDF)
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Enviar comprobante
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              También puedes enviar el comprobante por WhatsApp al:
            </p>
            <a
              href="https://wa.me/593999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Enviar por WhatsApp
            </a>
          </div>

          <div className="mt-8 pt-6 border-t text-center">
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
