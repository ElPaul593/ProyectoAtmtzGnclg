import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Clínica de Ginecología y Obstetricia
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Atención médica especializada para la salud de la mujer en todas las etapas de su vida
          </p>
          <Link
            href="/reservar"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Reservar Cita Ahora
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nuestros Servicios
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Consulta General',
                description: 'Evaluación completa de salud ginecológica',
                icon: '🩺',
              },
              {
                title: 'Control Prenatal',
                description: 'Seguimiento durante el embarazo',
                icon: '🤰',
              },
              {
                title: 'Ecografía',
                description: 'Estudios de imagen especializados',
                icon: '📊',
              },
              {
                title: 'Papanicolaou',
                description: 'Detección temprana de cáncer cervical',
                icon: '🔬',
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Lista para tu Consulta?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Agenda tu cita de manera rápida y segura. Aceptamos pagos con PayPal y transferencia bancaria.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/reservar"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Reservar Cita
            </Link>
            <Link
              href="/contacto"
              className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Clínica de Ginecología y Obstetricia. Todos los derechos reservados.</p>
          <div className="mt-4 space-x-4">
            <Link href="/servicios" className="hover:text-primary-300">Servicios</Link>
            <Link href="/contacto" className="hover:text-primary-300">Contacto</Link>
            <Link href="/preguntas-frecuentes" className="hover:text-primary-300">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
