import { LINKS } from '../constants/links';
import { MessageCircle, PhoneCall, CalendarCheck } from 'lucide-react';

const AppointmentCTA = () => {
    return (
        <section id="contacto" className="py-24 relative overflow-hidden bg-[#6A4C93]">
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F48FB1] opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

                <div className="mb-12 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Agenda tu Cita Hoy</h2>
                    <p className="text-xl text-[#E0D4FC] max-w-2xl mx-auto">
                        Prioriza tu bienestar. Elige el medio que prefieras y nos pondremos en contacto contigo lo antes posible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">

                    {/* Card 1: WhatsApp */}
                    <a
                        href={LINKS.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white/10 backdrop-blur-md rounded-3xl p-8 hover:bg-white transition-all duration-300 transform hover:-translate-y-2 border border-white/10"
                    >
                        <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                            <MessageCircle className="text-white w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-gray-900 transition-colors mb-2">WhatsApp</h3>
                        <p className="text-[#E0D4FC] group-hover:text-gray-500 transition-colors text-sm">
                            Respuesta inmediata
                        </p>
                    </a>

                    {/* Card 2: Call */}
                    <a
                        href={LINKS.phone}
                        className="group bg-white/10 backdrop-blur-md rounded-3xl p-8 hover:bg-white transition-all duration-300 transform hover:-translate-y-2 border border-white/10"
                    >
                        <div className="w-16 h-16 bg-[#2A9D8F] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#2A9D8F]/30 group-hover:scale-110 transition-transform">
                            <PhoneCall className="text-white w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-gray-900 transition-colors mb-2">Llamada</h3>
                        <p className="text-[#E0D4FC] group-hover:text-gray-500 transition-colors text-sm">
                            Atención personalizada
                        </p>
                    </a>

                    {/* Card 3: Form Placeholder (Link to external or modal) */}
                    <div className="group bg-white rounded-3xl p-8 transform hover:-translate-y-2 transition-all duration-300 shadow-xl cursor-not-allowed opacity-80">
                        <div className="w-16 h-16 bg-[#F48FB1] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#F48FB1]/30 group-hover:scale-110 transition-transform">
                            <CalendarCheck className="text-white w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Formulario Web</h3>
                        <p className="text-gray-500 text-sm">
                            Próximamente disponible
                        </p>
                    </div>

                </div>

                <p className="mt-12 text-[#E0D4FC]/80 text-sm">
                    * Respondemos todas las consultas en un plazo máximo de 24 horas.
                </p>

            </div>
        </section>
    );
};

export default AppointmentCTA;
