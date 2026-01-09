'use client';

import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-block bg-green-100 rounded-full p-4 mb-6">
            <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-4">¡Pago Exitoso!</h1>
          
          <p className="text-xl text-gray-700 mb-6">
            Tu cita ha sido confirmada exitosamente
          </p>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">¿Qué sigue?</h2>
            <ul className="text-left space-y-2 text-gray-700">
              <li>✅ Recibirás un correo de confirmación con los detalles de tu cita</li>
              <li>✅ La cita se ha agregado a tu calendario</li>
              <li>✅ Recibirás un recordatorio 24 horas antes</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Importante:</strong> Llega 10 minutos antes de tu cita y trae tu documento de identidad.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Volver al inicio
            </Link>
            
            <Link
              href="/contacto"
              className="block text-primary-600 hover:text-primary-700 font-semibold"
            >
              ¿Necesitas ayuda? Contáctanos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
