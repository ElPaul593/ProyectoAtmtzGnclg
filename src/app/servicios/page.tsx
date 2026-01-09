import Link from 'next/link';

export default function ServiciosPage() {
  const services = [
    {
      title: 'Consulta Ginecológica General',
      description: 'Evaluación completa de la salud ginecológica, incluyendo examen físico, historia clínica detallada y orientación sobre salud reproductiva.',
      duration: '30 minutos',
      price: '$50',
      includes: [
        'Examen físico completo',
        'Historia clínica detallada',
        'Orientación preventiva',
        'Plan de tratamiento personalizado',
      ],
    },
    {
      title: 'Control Prenatal',
      description: 'Seguimiento especializado durante el embarazo para garantizar la salud de la madre y el bebé.',
      duration: '45 minutos',
      price: '$75',
      includes: [
        'Evaluación del desarrollo fetal',
        'Monitoreo de signos vitales',
        'Orientación nutricional',
        'Detección de complicaciones',
      ],
    },
    {
      title: 'Ecografía Ginecológica/Obstétrica',
      description: 'Estudios de imagen especializados para evaluación ginecológica o seguimiento del embarazo.',
      duration: '30 minutos',
      price: '$60',
      includes: [
        'Ecografía de alta resolución',
        'Informe detallado',
        'Imágenes digitales',
        'Interpretación especializada',
      ],
    },
    {
      title: 'Papanicolaou (Citología Cervical)',
      description: 'Examen de detección temprana de cáncer cervical y otras alteraciones celulares.',
      duration: '20 minutos',
      price: '$40',
      includes: [
        'Toma de muestra cervical',
        'Análisis de laboratorio',
        'Resultados en 7-10 días',
        'Consulta de resultados',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Volver al inicio
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nuestros Servicios</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Atención médica especializada con tecnología de punta y profesionales altamente calificados
          </p>
        </div>

        <div className="space-y-8">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div className="flex-1 mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {service.title}
                    </h2>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                  <div className="md:ml-6 md:text-right">
                    <div className="text-3xl font-bold text-primary-600 mb-1">
                      {service.price}
                    </div>
                    <div className="text-sm text-gray-500">{service.duration}</div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Incluye:</h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <Link
                    href="/reservar"
                    className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                  >
                    Reservar este servicio
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-primary-50 border border-primary-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Necesitas más información?</h2>
          <p className="text-gray-700 mb-6">
            Nuestro equipo está disponible para responder todas tus preguntas
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
