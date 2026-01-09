'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: 'Reservas y Citas',
      questions: [
        {
          q: '¿Cómo puedo reservar una cita?',
          a: 'Puedes reservar tu cita de manera online a través de nuestro sistema de reservas. Simplemente selecciona el servicio, fecha y horario que prefieras, completa tus datos y realiza el pago.',
        },
        {
          q: '¿Puedo cancelar o reprogramar mi cita?',
          a: 'Sí, puedes cancelar o reprogramar tu cita con al menos 24 horas de anticipación sin cargo. Contáctanos por teléfono o correo para hacer el cambio.',
        },
        {
          q: '¿Cuánto tiempo antes debo llegar?',
          a: 'Recomendamos llegar 10 minutos antes de tu cita para completar cualquier documentación necesaria.',
        },
      ],
    },
    {
      category: 'Pagos',
      questions: [
        {
          q: '¿Qué métodos de pago aceptan?',
          a: 'Aceptamos pagos con PayPal (que incluye tarjetas de crédito/débito) y transferencias bancarias.',
        },
        {
          q: '¿Cuándo debo pagar?',
          a: 'El pago debe realizarse al momento de la reserva para confirmar tu cita. Si eliges transferencia bancaria, tienes que enviar el comprobante para que aprobemos tu cita.',
        },
        {
          q: '¿Puedo obtener un reembolso?',
          a: 'Los reembolsos se procesan solo en caso de cancelación con más de 24 horas de anticipación. El tiempo de procesamiento puede variar según el método de pago.',
        },
      ],
    },
    {
      category: 'Servicios Médicos',
      questions: [
        {
          q: '¿Qué debo traer a mi primera consulta?',
          a: 'Por favor trae tu cédula de identidad, historia clínica previa si la tienes, lista de medicamentos actuales y resultados de exámenes recientes.',
        },
        {
          q: '¿Los resultados de exámenes tienen costo adicional?',
          a: 'Los precios publicados incluyen la consulta y el procedimiento. Los análisis de laboratorio externos pueden tener costos adicionales que te informaremos con anticipación.',
        },
        {
          q: '¿Atienden emergencias?',
          a: 'Para emergencias médicas graves, por favor acude al servicio de emergencias más cercano o llama al 911. Nuestra clínica atiende con cita previa.',
        },
      ],
    },
    {
      category: 'Control Prenatal',
      questions: [
        {
          q: '¿Con qué frecuencia debo asistir a control prenatal?',
          a: 'Durante el primer y segundo trimestre, recomendamos una consulta mensual. En el tercer trimestre, las visitas son más frecuentes (cada 2 semanas y luego semanales cerca del parto).',
        },
        {
          q: '¿Qué incluye el control prenatal?',
          a: 'Incluye evaluación del desarrollo fetal, monitoreo de signos vitales, orientación nutricional, detección temprana de complicaciones y seguimiento personalizado.',
        },
      ],
    },
    {
      category: 'Privacidad y Seguridad',
      questions: [
        {
          q: '¿Cómo protegen mi información personal?',
          a: 'Toda tu información médica y personal se maneja bajo estrictos protocolos de confidencialidad. Cumplimos con todas las normativas de protección de datos médicos.',
        },
        {
          q: '¿Es seguro el pago online?',
          a: 'Sí, todos los pagos se procesan a través de PayPal con encriptación de grado bancario. Nunca almacenamos información de tarjetas de crédito en nuestros servidores.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Volver al inicio
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Preguntas Frecuentes</h1>
          <p className="text-xl text-gray-600">
            Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, categoryIdx) => (
            <div key={categoryIdx}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIdx) => {
                  const index = categoryIdx * 100 + faqIdx;
                  const isOpen = openIndex === index;

                  return (
                    <div
                      key={faqIdx}
                      className="bg-white rounded-lg shadow overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                      >
                        <span className="font-semibold text-gray-900 pr-4">
                          {faq.q}
                        </span>
                        <svg
                          className={`w-5 h-5 text-primary-600 transform transition-transform flex-shrink-0 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-primary-50 border border-primary-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">¿No encontraste tu respuesta?</h2>
          <p className="text-gray-700 mb-6">
            Estamos aquí para ayudarte. Contáctanos y resolveremos todas tus dudas.
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  );
}
